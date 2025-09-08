console.log('🔸 1. Iniciando servidor...');

require('dotenv').config();
console.log('🔸 2. Dotenv carregado');

console.log('🔸 3. Importando app...');
const app = require('./app');
console.log('🔸 4. App importado');

console.log('🔸 5. Importando models...');
const { syncDatabase } = require('./models');
console.log('🔸 6. Models importados');

const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0'; // Aceita conexões externas
console.log('🔸 7. Porta definida:', PORT);
console.log('🔸 7.1. Host definido:', HOST);

const createInitialPlans = require('./seeders/initialPlans');

// Inicializar servidor
const startServer = async () => {
  try {
    console.log('🔸 8. Sincronizando banco...');
    await syncDatabase();
    await createInitialPlans(); // CRIA PLANOS AUTOMATICAMENTE
    console.log('🔸 9. Banco sincronizado!');
    
    console.log('🔸 10. Iniciando servidor HTTP...');
    app.listen(PORT, HOST, () => {
      console.log(`🚀 Servidor rodando em: http://${HOST}:${PORT}`);
      console.log(`🌐 Acesso externo: http://186.251.163.123:${PORT}`);
      console.log(`🔗 GGCloudD DuckDNS: http://ggcloudd.duckdns.org:${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Falha ao iniciar servidor:', error);
    process.exit(1);
  }
};

console.log('🔸 11. Chamando startServer...');
startServer();
console.log('🔸 12. StartServer chamado');