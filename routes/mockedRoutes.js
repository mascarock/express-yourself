const express = require('express');
const { getMockedFiles, getMockedFileByName } = require('../controllers/mockedController');

const router = express.Router();

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
router.get('/files', getMockedFiles);

/**
 * @swagger
 * /mocked/file/{name}:
 *   get:
 *     summary: Download a specific file (mocked).
 *     description: Simulates downloading a CSV file by name.
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
router.get('/file/:name', getMockedFileByName);

module.exports = router;