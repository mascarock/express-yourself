const swaggerJsDoc = require('swagger-jsdoc')

const PORT = process.env.PORT || 5005

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Express Yourself API',
      version: '1.1.0',
      description: 'API documentation for Express Yourself'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local server'
      }
    ]
  },
  apis: ['./routes/*.js'] // Look for Swagger annotations in all route files
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)

module.exports = swaggerDocs
