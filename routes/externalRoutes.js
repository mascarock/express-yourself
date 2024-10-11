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
 * /files/data:
 *   get:
 *     summary: Fetch and aggregate data from all available files.
 *     description: Fetches data from all available files, processes it, and returns a JSON response.
 *     responses:
 *       200:
 *         description: Successfully fetched and aggregated data from available files.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   file:
 *                     type: string
 *                   lines:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         text:
 *                           type: string
 *                         number:
 *                           type: number
 *                         hex:
 *                           type: string
 *       500:
 *         description: Error occurred while fetching the files.
 */
router.get('/files/data', async (req, res) => {
  try {
    const files = await getFilesFromExternalAPI();
    const aggregatedData = [];

    // Loop through each file and try to fetch its content
    for (const file of files) {
      try {
        const fileData = await getFileFromExternalAPI(file);

        // Only add files that have non-empty lines
        if (fileData && fileData.lines && fileData.lines.length > 0) {
          aggregatedData.push(fileData);
        } else {
          console.warn(`Skipping file ${file}: No valid data found.`);
        }
      } catch (error) {
        // Skip files that could not be found or fetched
        console.warn(`Skipping file ${file} due to an error: ${error.message}`);
      }
    }

    res.status(200).json(aggregatedData);
  } catch (error) {
    console.error('Error fetching file data from external API:', error);
    res.status(500).json({ error: 'Failed to fetch files data from external API' });
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
    res.status(200).json(response);
  } catch (error) {
    if (error.status === 404) {
      res.status(404).json({ error: 'File not found' });
    } else {
      res.status(500).json({ error: 'Failed to download file from external API' });
    }
  }
});


module.exports = router;
