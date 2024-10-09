const axios = require('axios');
const externalApiBaseUrl = 'https://echo-serv.tbxnet.com/v1/secret';
const externalApiKey = process.env.API_KEY;

// Controller function to fetch a list of files from the external API
const getFilesFromExternalAPI = async () => {
  try {
    const response = await axios.get(`${externalApiBaseUrl}/files`, {
      headers: {
        Authorization: externalApiKey,
      },
    });
    return response.data.files;
  } catch (error) {
    throw new Error('Failed to fetch files from external API');
  }
};

// Controller function to fetch a specific file from the external API by its name
const getFileFromExternalAPI = async (fileName) => {
  try {
    const response = await axios.get(`${externalApiBaseUrl}/file/${fileName}`, {
      headers: {
        Authorization: externalApiKey,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('File not found');
    } else {
      throw new Error('Failed to download file from external API');
    }
  }
};

module.exports = {
  getFilesFromExternalAPI,
  getFileFromExternalAPI,
};
