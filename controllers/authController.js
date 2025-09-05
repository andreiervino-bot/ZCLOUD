const { User } = require('../models');
const { generateToken } = require('../utils/token');

// Registro de novo usuário
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Verifica se usuário já existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Cria novo usuário
    const user = await User.create({
      name,
      email,
      password // Será criptografado automaticamente pelo hook no modelo
    });

    // Gera token JWT
    const token = generateToken(user.id);

    // Retorna usuário e token (sem a senha)
    res.status(201).json({
      message: 'Usuário criado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        storage_used: user.storage_used,
        storage_limit: user.storage_limit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
  }
};

// Login de usuário
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Encontra usuário pelo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Verifica senha
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gera token JWT
    const token = generateToken(user.id);

    // Retorna usuário e token
    res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        storage_used: user.storage_used,
        storage_limit: user.storage_limit,
        storage_info: user.getStorageInfo()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login', details: error.message });
  }
};

// Pegar perfil do usuário logado
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] } // Não retorna a senha
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      user: {
        ...user.toJSON(),
        storage_info: user.getStorageInfo()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil', details: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
};