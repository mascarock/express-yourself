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
 *                 error:
 *                   type: string
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

module.exports = router;
