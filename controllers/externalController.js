const axios = require('axios')
const { isValidHex32 } = require('./utils')
const externalApiBaseUrl = process.env.API_URL
const externalApiKey = process.env.API_KEY

// Controller function to fetch a list of files from the external API
const getFilesFromExternalAPI = async () => {
  try {
    const response = await axios.get(`${externalApiBaseUrl}/files`, {
      headers: {
        Authorization: externalApiKey
      }
    })
    return response.data.files
  } catch (error) {
    throw new Error('Failed to fetch files from external API')
  }
}

// Controller function to fetch a specific file from the external API by its name
const getFileFromExternalAPI = async (fileName) => {
  try {
    const response = await axios.get(`${externalApiBaseUrl}/file/${fileName}`, {
      headers: {
        Authorization: externalApiKey
      }
    })

    // Process the CSV content into JSON format as per the schema
    const lines = response.data
      .split('\n')
      .slice(1) // Skip the header row
      .map(line => {
        const [file, text, number, hex] = line.split(',')
        if (!text || isNaN(parseInt(number)) || !hex || !isValidHex32(hex)) {
          return null // Skip invalid lines
        }
        return { text, number: parseInt(number, 10), hex }
      })
      .filter(Boolean) // Remove null values

    return {
      file: fileName,
      lines
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // Explicitly throw an error with status 404
      const notFoundError = new Error('File not found')
      notFoundError.status = 404
      throw notFoundError
    } else {
      // Throw a general error for other types of issues
      const generalError = new Error('Failed to download file from external API')
      generalError.status = 500
      throw generalError
    }
  }
}

module.exports = {
  getFilesFromExternalAPI,
  getFileFromExternalAPI
}
