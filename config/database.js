// Importa a classe Sequelize do pacote
const { Sequelize } = require('sequelize');
// Importa as configurações do banco de dados
const config = require('./dbConfig');

// Define o ambiente (development, production, test)
const env = process.env.NODE_ENV || 'development';
// Pega as configurações específicas do ambiente
const dbConfig = config[env];

// Variável para armazenar a instância do Sequelize
let sequelize;

// Verifica se deve usar variável de ambiente (para produção)
if (dbConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} 
// Se for SQLite (usado em desenvolvimento)
else if (dbConfig.storage) {
  sequelize = new Sequelize({
    dialect: 'sqlite',           // Tipo do banco
    storage: dbConfig.storage,   // Caminho do arquivo SQLite
    logging: dbConfig.logging    // Mostrar logs no console?
  });
} 
// Se for MySQL/PostgreSQL (com credenciais)
else {
  sequelize = new Sequelize(
    dbConfig.database,   // Nome do banco
    dbConfig.username,   // Usuário do banco
    dbConfig.password,   // Senha do banco
    dbConfig            // Configurações adicionais
  );
}

// Testa a conexão com o banco
sequelize.authenticate()
  .then(() => console.log('✅ Banco de dados conectado!'))
  .catch(err => console.error('❌ Erro na conexão:', err));

// Exporta a INSTÂNCIA do Sequelize (já conectada)
module.exports = sequelize;