from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr
import os
import uuid
import json
import re

app = FastAPI()
security = HTTPBearer()

# Diretório base
BASE_DIR = "user_uploads"
os.makedirs(BASE_DIR, exist_ok=True)

# Modelo para usuário
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# "Banco de dados" simples (em arquivo JSON)
USERS_FILE = "users.json"

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f)

# Função para validar força da senha
def validate_password(password: str):
    if len(password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Senha deve ter pelo menos 6 caracteres"
        )

# Função para verificar token/usuário
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    users = load_users()
    if credentials.credentials not in users:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado"
        )
    return credentials.credentials

# Rota de registro
@app.post("/register")
def register(user: UserRegister):
    users = load_users()
    
    # Verifica se usuário já existe
    if user.username in users:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Usuário já existe"
        )
    
    # Verifica se email já está cadastrado
    for username, data in users.items():
        if data["email"] == user.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )
    
    # Valida força da senha
    validate_password(user.password)
    
    # Gera token de acesso
    token = str(uuid.uuid4())
    users[user.username] = {
        "email": user.email,
        "password": user.password,  # Em produção, usar hash!
        "token": token
    }
    
    # Cria pasta do usuário
    user_dir = os.path.join(BASE_DIR, user.username)
    os.makedirs(user_dir, exist_ok=True)
    
    save_users(users)
    return {
        "message": "Usuário criado com sucesso!",
        "token": token,
        "user": {
            "username": user.username,
            "email": user.email
        }
    }

# Rota de login
@app.post("/login")
def login(user: UserLogin):
    users = load_users()
    
    if user.username not in users or users[user.username]["password"] != user.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciais inválidas"
        )
    
    return {
        "message": "Login bem-sucedido",
        "token": users[user.username]["token"],
        "user": {
            "username": user.username,
            "email": users[user.username]["email"]
        }
    }

# Rota principal (protegida)
@app.get("/")
def read_root(current_user: str = Depends(get_current_user)):
    users = load_users()
    return {
        "message": f"Olá {current_user}!",
        "email": users[current_user]["email"],
        "status": "Servidor de backup ativo 🚀"
    }

# Upload de arquivo (protegido)
@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    current_user: str = Depends(get_current_user)
):
    user_dir = os.path.join(BASE_DIR, current_user)
    os.makedirs(user_dir, exist_ok=True)
    
    file_path = os.path.join(user_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    return {"message": f"Arquivo {file.filename} salvo na sua pasta pessoal!"}

# Listar arquivos do usuário (protegido)
@app.get("/files")
def list_files(current_user: str = Depends(get_current_user)):
    user_dir = os.path.join(BASE_DIR, current_user)
    if not os.path.exists(user_dir):
        return {"files": []}
    
    files = os.listdir(user_dir)
    return {
        "username": current_user,
        "email": load_users()[current_user]["email"],
        "files": files
    }

# Rota para pegar perfil do usuário (protegido)
@app.get("/profile")
def get_profile(current_user: str = Depends(get_current_user)):
    users = load_users()
    user_data = users[current_user]
    
    user_dir = os.path.join(BASE_DIR, current_user)
    file_count = len(os.listdir(user_dir)) if os.path.exists(user_dir) else 0
    
    return {
        "username": current_user,
        "email": user_data["email"],
        "file_count": file_count,
        "account_created": "2024"  # Em produção, salvar data de criação
    }