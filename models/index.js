// Importa a instância do Sequelize (já configurada)
const sequelize = require('../config/database');
// ✅ CORRETO: Importa e inicializa os modelos
const User = require('./User')(sequelize);
const Backup = require('./Backup')(sequelize);
const Plan = require('./Plan')(sequelize);

// ✅ ADICIONA AS ASSOCIAÇÕES:
User.hasMany(Backup, { foreignKey: 'userId' });
Backup.belongsTo(User, { foreignKey: 'userId' });
User.belongsTo(Plan, { foreignKey: 'planId' });
Plan.hasMany(User, { foreignKey: 'planId' });
// ✅ OBJETO COM TODOS OS MODELOS
const models = {
  User,
  Backup,
  Plan
};

// Função para sincronizar modelos com o banco
const syncDatabase = async () => {
  try {
    // ⚠️ Mude para alter: false para evitar loops!
    await sequelize.sync({ force: false, alter: false });
    console.log('✅ Modelos sincronizados com o banco!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar modelos:', error);
    throw error;
  }
};

// Exporta TUDO para usar em outros arquivos
module.exports = {
  ...models,          // Exporta User e Backup
  sequelize,          // Exporta a instância do Sequelize
  syncDatabase        // Exporta a função de sincronização
};