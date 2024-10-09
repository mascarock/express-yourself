/**
 * @file server.js
 * @description Entry point for the Express server. This server includes API routes for both mocked and external file handling.
 * @version 1.1.0
 * @author @mascarock
 */

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger/swaggerConfig');
const mockedRoutes = require('./routes/mockedRoutes');
const externalRoutes = require('./routes/externalRoutes');

const app = express();
const PORT = process.env.PORT || 5005;

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Use routes
app.use('/mocked', mockedRoutes);
app.use('/', externalRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
