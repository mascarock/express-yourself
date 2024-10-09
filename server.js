/**
 * @file server.js
 * @description Basic Express server to handle file listing and downloading functionality. This API includes four endpoints:
 * 1. To fetch a list of available files (mocked).
 * 2. To download a specific file by its name (mocked).
 * 3. To fetch a list of files from the external API.
 * 4. To download a specific file by its name from the external API.
 * @version 1.1.0
 * @author @mascarock
 */

require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();
const PORT = process.env.PORT || 5005;

// External API details
const externalApiBaseUrl = 'https://echo-serv.tbxnet.com/v1/secret';
const externalApiKey = process.env.API_KEY; // Now using the API key from the environment variable

// Mock external API response for file listing
const mockFileList = ["file1.csv", "file2.csv", "file3.csv"];

/**
 * @swagger
 * /mocked/files:
 *   get:
 *     summary: Fetch a list of available files (mocked).
 *     description: Returns a mock list of available files to simulate an external API response.
 *     responses:
 *       200:
 *         description: Successfully fetched the list of files.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 */
app.get('/mocked/files', (req, res) => {
    res.json({ files: mockFileList });
});

/**
 * @swagger
 * /mocked/file/{name}:
 *   get:
 *     summary: Download a specific file (mocked).
 *     description: Simulates downloading a CSV file by name. If the file is not in the mock list, returns a 404 error.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to download.
 *     responses:
 *       200:
 *         description: Successfully downloaded the file.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       404:
 *         description: File not found.
 *       500:
 *         description: Error occurred while downloading the file.
 */
app.get('/mocked/file/:name', async (req, res) => {
    const fileName = req.params.name;

    // Check if the file exists in the mock list
    if (!mockFileList.includes(fileName)) {
        return res.status(404).json({ error: 'File not found' });
    }

    try {
        // Simulate the download of the file (normally you'd use axios to get from an external source)
        const fileContent = `file,text,number,hex\n${fileName},RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765`;
        
        // Send file content as response
        res.setHeader('Content-Type', 'text/csv');
        res.send(fileContent);
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
});

/**
 * @swagger
 * /files:
 *   get:
 *     summary: Fetch a list of available files from the external API.
 *     description: Fetches a list of available files from the external API using the provided API key.
 *     responses:
 *       200:
 *         description: Successfully fetched the list of files from the external API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Error occurred while fetching the list of files.
 */
app.get('/files', async (req, res) => {
    try {
        const response = await axios.get(`${externalApiBaseUrl}/files`, {
            headers: {
                Authorization: externalApiKey,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching files from external API:', error);
        res.status(500).json({ error: 'Failed to fetch files from external API' });
    }
});

/**
 * @swagger
 * /file/{name}:
 *   get:
 *     summary: Download a specific file from the external API.
 *     description: Downloads a specific file by name from the external API. If the file is not found, returns a 404 error.
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to download.
 *     responses:
 *       200:
 *         description: Successfully downloaded the file from the external API.
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       404:
 *         description: File not found.
 *       500:
 *         description: Error occurred while downloading the file.
 */
app.get('/file/:name', async (req, res) => {
    const fileName = req.params.name;

    try {
        const response = await axios.get(`${externalApiBaseUrl}/file/${fileName}`, {
            headers: {
                Authorization: externalApiKey,
            },
        });
        res.setHeader('Content-Type', 'text/csv');
        res.send(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
            res.status(404).json({ error: 'File not found' });
        } else {
            console.error('Error fetching file from external API:', error);
            res.status(500).json({ error: 'Failed to download file from external API' });
        }
    }
});

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Express Yourself API',
      version: '1.1.0',
      description: 'API documentation for Express Yourself',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Local server',
      },
    ],
  },
  apis: ['./server.js'], // Where Swagger should look for annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;