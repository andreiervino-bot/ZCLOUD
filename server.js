console.log('🔸 1. Iniciando servidor...');

require('dotenv').config();
console.log('🔸 2. Dotenv carregado');

console.log('🔸 3. Importando app...');
const app = require('./app');
console.log('🔸 4. App importado');

console.log('🔸 5. Importando models...');
const { syncDatabase } = require('./models');
console.log('🔸 6. Models importados');

const PORT = process.env.PORT || 3000;
console.log('🔸 7. Porta definida:', PORT);

const createInitialPlans = require('./seeders/initialPlans');

// Inicializar servidor
const startServer = async () => {
  try {
    console.log('🔸 8. Sincronizando banco...');
    await syncDatabase();
    await createInitialPlans(); //CRIA PLANOS AUTOMATICAMENTE
    console.log('🔸 9. Banco sincronizado!');
    
    console.log('🔸 10. Iniciando servidor HTTP...');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
      console.log(`🔗 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};



console.log('🔸 11. Chamando startServer...');
startServer();
console.log('🔸 12. StartServer chamado');