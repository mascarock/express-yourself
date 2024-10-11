const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');
const externalRoutes = require('../routes/externalRoutes');
const axios = require('axios');
const sinon = require('sinon'); // Import Sinon
const { expect } = chai;

chai.use(chaiHttp);

const app = express();
app.use('/', externalRoutes);

describe('External API Routes (Mocha and Chai)', () => {
  let getStub; // Variable to hold the stub

  beforeEach(() => {
    // Stub axios.get before each test
    getStub = sinon.stub(axios, 'get');
  });

  afterEach(() => {
    // Restore axios.get after each test
    getStub.restore();
  });

  describe('GET /files', () => {
    it('should fetch a list of available files from the external API', async () => {
      const mockResponse = { files: ['test1.csv', 'test2.csv', 'test3.csv'] };
      getStub.resolves({ data: mockResponse }); // Use Sinon to resolve the Promise

      const res = await chai.request(app).get('/files');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal(mockResponse);
    });

    it('should return a 500 error if the external API call fails', async () => {
      getStub.rejects(new Error('External API Error')); // Use Sinon to reject the Promise

      const res = await chai.request(app).get('/files');

      expect(res).to.have.status(500);
      expect(res.body).to.have.property('error', 'Failed to fetch files from external API');
    });

    it('should fetch a non-empty list of files from the external API', async () => {
      const mockResponse = { files: ['file1.csv', 'file2.csv'] };
      getStub.resolves({ data: mockResponse });

      const res = await chai.request(app).get('/files');

      expect(res).to.have.status(200);
      expect(res.body.files).to.have.length.greaterThan(0);
    });

    it('should handle empty list of files from the external API', async () => {
      const mockResponse = { files: [] };
      getStub.resolves({ data: mockResponse });

      const res = await chai.request(app).get('/files');

      expect(res).to.have.status(200);
      expect(res.body.files).to.have.lengthOf(0);
    });
  });

  describe('GET /file/:name', () => {
    it('should download a specific file from the external API', async () => {
      const mockFileContent = 'file,text,number,hex\ntest1.csv,example,1234,1234567890abcdef1234567890abcdef';
      getStub.resolves({ data: mockFileContent });

      const res = await chai.request(app).get('/file/test1.csv');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({
        file: 'test1.csv',
        lines: [
          {
            text: 'example',
            number: 1234,
            hex: '1234567890abcdef1234567890abcdef'
          }
        ]
      });
    });

    it('should return a 404 error if the file is not found in the external API', async () => {
      const error = new Error('Not Found');
      error.response = { status: 404 };
      getStub.rejects(error);

      const res = await chai.request(app).get('/file/nonexistent.csv');

      expect(res).to.have.status(404);
      expect(res.body).to.have.property('error', 'File not found');
    });

    it('should return a 500 error if there is an error downloading the file', async () => {
      getStub.rejects(new Error('External API Error'));

      const res = await chai.request(app).get('/file/test1.csv');

      expect(res).to.have.status(500);
      expect(res.body).to.have.property('error', 'Failed to download file from external API');
    });

    it('should handle file content properly from the external API', async () => {
      const mockFileContent = 'file,text,number,hex\ntest1.csv,data,5678,abcdefabcdefabcdefabcdefabcdefab';
      getStub.resolves({ data: mockFileContent });

      const res = await chai.request(app).get('/file/test1.csv');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({
        file: 'test1.csv',
        lines: [
          {
            text: 'data',
            number: 5678,
            hex: 'abcdefabcdefabcdefabcdefabcdefab'
          }
        ]
      });
    });

    it('should skip invalid lines in the CSV content', async () => {
      const mockFileContent = `file,text,number,hex
test1.csv,data,5678,abcdefabcdefabcdefabcdefabcdefab
invalid,line
another,missing,data
test1.csv,data2,91011,invalidhexvalue`; // Invalid hex length or format
      getStub.resolves({ data: mockFileContent });

      const res = await chai.request(app).get('/file/test1.csv');

      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({
        file: 'test1.csv',
        lines: [
          {
            text: 'data',
            number: 5678,
            hex: 'abcdefabcdefabcdefabcdefabcdefab'
          }
        ]
      });
    });
  });
});
