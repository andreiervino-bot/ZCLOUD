const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// Gera token JWT para o usuário
const generateToken = (userId) => {
  return jwt.sign(
    { userId },                 // Dados que ficam dentro do token
    JWT_SECRET,                 // Segredo para assinar o token
    { expiresIn: '7d' }         // Token expira em 7 dias
  );
};

// Verifica se token é válido
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
};

// Middleware para proteger rotas
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token de acesso necessário' });
    }

    const decoded = verifyToken(token);
    req.userId = decoded.userId; // Adiciona userId na requisição
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware
};