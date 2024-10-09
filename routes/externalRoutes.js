const express = require('express');
const { getFilesFromExternalAPI, getFileFromExternalAPI } = require('../controllers/externalController');

const router = express.Router();

/**
 * @swagger
 * /files:
 *   get:
 *     summary: Fetch a list of available files from the external API.
 *     description: Fetches a list of available files from the external API.
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
router.get('/files', getFilesFromExternalAPI);

/**
 * @swagger
 * /file/{name}:
 *   get:
 *     summary: Download a specific file from the external API.
 *     description: Downloads a specific file by name from the external API.
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
router.get('/file/:name', getFileFromExternalAPI);

module.exports = router;