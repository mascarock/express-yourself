const axios = require('axios');
const externalApiBaseUrl = 'https://echo-serv.tbxnet.com/v1/secret';
const externalApiKey = process.env.API_KEY;

const getFilesFromExternalAPI = async (req, res) => {
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
};

const getFileFromExternalAPI = async (req, res) => {
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
};

module.exports = {
    getFilesFromExternalAPI,
    getFileFromExternalAPI
};
