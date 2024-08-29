import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes/index'; // aqui tenho um erro

const app = express();

// Configurações do Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Medidor Água e Gás API',
    version: '1.0.0',
    description:
      'API para gerenciar a leitura individualizada do consumo de água e gás.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
