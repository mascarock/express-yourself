const request = require('supertest');
const express = require('express');
const externalRoutes = require('../routes/externalRoutes');
const axios = require('axios');

jest.mock('axios');

const app = express();
app.use('/external', externalRoutes);

describe('External API Routes', () => {
  describe('GET /external/files', () => {
    it('should fetch a list of available files from the external API', async () => {
      const mockResponse = { files: ['test1.csv', 'test2.csv', 'test3.csv'] };
      axios.get.mockResolvedValue({ data: mockResponse });

      const res = await request(app).get('/external/files');

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(mockResponse);
    });

    it('should return a 500 error if the external API call fails', async () => {
      axios.get.mockRejectedValue(new Error('External API Error'));

      const res = await request(app).get('/external/files');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Failed to fetch files from external API');
    });

    it('should fetch a non-empty list of files from the external API', async () => {
      const mockResponse = { files: ['file1.csv', 'file2.csv'] };
      axios.get.mockResolvedValue({ data: mockResponse });

      const res = await request(app).get('/external/files');

      expect(res.statusCode).toEqual(200);
      expect(res.body.files.length).toBeGreaterThan(0);
    });

    it('should handle empty list of files from the external API', async () => {
      const mockResponse = { files: [] };
      axios.get.mockResolvedValue({ data: mockResponse });

      const res = await request(app).get('/external/files');

      expect(res.statusCode).toEqual(200);
      expect(res.body.files.length).toEqual(0);
    });
  });

  describe('GET /external/file/:name', () => {
    it('should download a specific file from the external API', async () => {
      const mockFileContent = 'file,text,number,hex\ntest1.csv,example,1234,abcdef';
      axios.get.mockResolvedValue({ data: mockFileContent });

      const res = await request(app).get('/external/file/test1.csv');

      expect(res.statusCode).toEqual(200);
      expect(res.text).toEqual(mockFileContent);
    });

    it('should return a 404 error if the file is not found in the external API', async () => {
      axios.get.mockRejectedValue({ response: { status: 404 } });

      const res = await request(app).get('/external/file/nonexistent.csv');

      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'File not found');
    });

    it('should return a 500 error if there is an error downloading the file', async () => {
      axios.get.mockRejectedValue(new Error('External API Error'));

      const res = await request(app).get('/external/file/test1.csv');

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error', 'Failed to download file from external API');
    });

    it('should handle file content properly from the external API', async () => {
      const mockFileContent = 'file,text,number,hex\ntest1.csv,data,5678,abcd1234';
      axios.get.mockResolvedValue({ data: mockFileContent });

      const res = await request(app).get('/external/file/test1.csv');

      expect(res.statusCode).toEqual(200);
      expect(res.text).toContain('test1.csv');
    });
  });
});

module.exports = app;