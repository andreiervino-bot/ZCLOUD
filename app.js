const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { swaggerUi, specs } = require('./utils/swagger');
const backupRoutes = require('./routes/backups');
const planRoutes = require('./routes/plans');
const adminRoutes = require('./routes/admin');

// ✅ IMPORTAR AS ROTAS (adiciona isso!)
const authRoutes = require('./routes/auth');

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/backups', backupRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/admin', adminRoutes);

// ✅ SWAGGER DOCS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// ✅ ROTAS DA API (TIRA O COMENTÁRIO!)
app.use('/api/auth', authRoutes);

// Rotas básicas de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ZCloud Backend está funcionando! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Rota padrão
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo ao ZCloud Backup API!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      docs: '/api-docs',
      auth: '/api/auth' // ✅ ATUALIZA TAMBÉM!
    }
  });
});

// Middleware de erro
app.use((error, req, res, next) => {
  console.error('💥 Erro:', error);
  res.status(error.status || 500).json({
    error: {
      message: error.message || 'Erro interno do servidor',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  });
});

// Rota não encontrada
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;