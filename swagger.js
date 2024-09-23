const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API FarmaRolling',
    version: '1.0.0',
    description: 'Documentación API de Farma Rolling',
  },
  components: {
    securitySchemes: {
      authHeader: {
        type: 'apiKey',
        in: 'header',
        name: 'auth',
        description: 'Token JWT en el encabezado `auth`',
      },
    },
  },
  security: [
    {
      authHeader: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
