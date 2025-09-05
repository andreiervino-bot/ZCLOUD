const { User, Plan, Backup } = require('../models');

// Listar todos os usuários
const listUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{
        model: Plan,
        attributes: ['name', 'storage_limit']
      }]
    });
    
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários', details: error.message });
  }
};

// Estatísticas do sistema
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalFiles = await Backup.count();
    const totalStorageUsed = await Backup.sum('fileSize');
    const activePlans = await Plan.count({ where: { is_active: true } });
    
    res.json({
      total_users: totalUsers,
      total_files: totalFiles,
      total_storage_used: totalStorageUsed,
      active_plans: activePlans
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas', details: error.message });
  }
};

// Criar novo plano
const createPlan = async (req, res) => {
  try {
    const { name, description, storage_limit, price } = req.body;
    
    const plan = await Plan.create({
      name,
      description,
      storage_limit,
      price: price || 0.00
    });
    
    res.status(201).json({ message: 'Plano criado com sucesso!', plan });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar plano', details: error.message });
  }
};

// Banir usuário
const banUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    await user.update({ is_banned: true });
    res.json({ message: 'Usuário banido com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao banir usuário', details: error.message });
  }
};

// Tornar usuário admin
const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    await user.update({ is_admin: true });
    res.json({ message: 'Usuário promovido a administrador!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao promover usuário', details: error.message });
  }
};

// Alterar plano de usuário
const changeUserPlan = async (req, res) => {
  try {
    const { userId, planId } = req.body;
    
    const user = await User.findByPk(userId);
    const plan = await Plan.findByPk(planId);
    
    if (!user || !plan) {
      return res.status(404).json({ error: 'Usuário ou plano não encontrado' });
    }
    
    await user.update({ 
      planId: plan.id,
      storage_limit: plan.storage_limit
    });
    
    res.json({ message: 'Plano do usuário atualizado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao alterar plano', details: error.message });
  }
};

module.exports = {
  listUsers,
  getStats,
  createPlan,
  banUser,
  makeAdmin,
  changeUserPlan
};