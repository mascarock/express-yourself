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
router.get('/files', async (req, res) => {
  try {
    const files = await getFilesFromExternalAPI();
    res.status(200).json({ files });
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
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: string
 *                 lines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                       number:
 *                         type: number
 *                       hex:
 *                         type: string
 *       404:
 *         description: File not found.
 *       500:
 *         description: Error occurred while downloading the file.
 */
router.get('/file/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const response = await getFileFromExternalAPI(name);
    if (response.error) {
      if (response.error === 'File not found') {
        res.status(404).json(response);
      } else {
        res.status(500).json(response);
      }
    } else {
      res.status(200).json(response);
    }
  } catch (error) {
    console.error('Error fetching file from external API:', error);
    res.status(500).json({ error: 'Failed to download file from external API' });
  }
});

/**
 * @swagger
 * /files/data:
 *   get:
 *     summary: Fetch data for a specific file using query parameter.
 *     description: Fetches the data for a specific file by providing the file name as a query parameter.
 *     parameters:
 *       - in: query
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the file to fetch data for.
 *     responses:
 *       200:
 *         description: Successfully fetched the data for the specified file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:
 *                   type: string
 *                 lines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: string
 *                       number:
 *                         type: number
 *                       hex:
 *                         type: string
 *       400:
 *         description: "Missing required query parameter: fileName"
 *       404:
 *         description: File not found.
 *       500:
 *         description: Error occurred while fetching data for the specified file.
 */
router.get('/files/data', async (req, res) => {
  const { fileName } = req.query;
  if (!fileName) {
    return res.status(400).json({ error: 'Missing required query parameter: fileName' });
  }

  try {
    const fileData = await getFileFromExternalAPI(fileName);
    res.status(200).json(fileData);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ error: 'File not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch data for the specified file' });
    }
  }
});

module.exports = router;
