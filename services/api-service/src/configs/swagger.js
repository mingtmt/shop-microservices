const swaggerJsdoc = require('swagger-jsdoc')
const path = require('path')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shop Service API Documentation',
      version: '1.0.0',
      description: 'API documentation for Shop Service E-commerce project',
      contact: {
        name: 'Developer',
        email: 'dev@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8008',
        description: 'Development Server',
      },
      {
        url: 'https://api.production.com',
        description: 'Production Server',
      },
    ],
    // Config authorize button
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, '../../documents/**/*.yaml')],
}

const specs = swaggerJsdoc(options)
module.exports = specs
