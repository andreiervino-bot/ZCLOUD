const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ZCloud Backup API',
      version: '1.0.0',
      description: 'API para sistema de backup em nuvem',
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Servidor de desenvolvimento',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js', './models/*.js'], // caminho dos arquivos com documentação
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };