const { User } = require('../models');

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user || !user.is_admin) {
      return res.status(403).json({ error: 'Acesso restrito a administradores' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Erro de autenticação administrativa' });
  }
};

module.exports = adminAuth;