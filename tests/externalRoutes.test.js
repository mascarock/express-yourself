const request = require('supertest')
const express = require('express')
const externalRoutes = require('../routes/externalRoutes')
const axios = require('axios')

jest.mock('axios')

const app = express()
app.use('/', externalRoutes)

describe('External API Routes', () => {
  describe('GET /files/list', () => {
    it('should fetch a list of available files from the external API', async () => {
      const mockResponse = { files: ['test1.csv', 'test2.csv', 'test3.csv'] }
      axios.get.mockResolvedValue({ data: mockResponse })

      const res = await request(app).get('/files/list')

      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual(mockResponse)
    })

    it('should return a 500 error if the external API call fails', async () => {
      axios.get.mockRejectedValue(new Error('External API Error'))

      const res = await request(app).get('/files/list')

      expect(res.statusCode).toEqual(500)
      expect(res.body).toHaveProperty('error', 'Failed to fetch files from external API')
    })

    it('should fetch a non-empty list of files from the external API', async () => {
      const mockResponse = { files: ['file1.csv', 'file2.csv'] }
      axios.get.mockResolvedValue({ data: mockResponse })

      const res = await request(app).get('/files/list')

      expect(res.statusCode).toEqual(200)
      expect(res.body.files.length).toBeGreaterThan(0)
    })

    it('should handle empty list of files from the external API', async () => {
      const mockResponse = { files: [] }
      axios.get.mockResolvedValue({ data: mockResponse })

      const res = await request(app).get('/files/list')

      expect(res.statusCode).toEqual(200)
      expect(res.body.files.length).toEqual(0)
    })
  })

  describe('GET /file/:name', () => {
    it('should download a specific file from the external API', async () => {
      const mockFileContent = 'file,text,number,hex\ntest1.csv,example,1234,1234567890abcdef1234567890abcdef'
      axios.get.mockResolvedValue({ data: mockFileContent })

      const res = await request(app).get('/file/test1.csv')

      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({
        file: 'test1.csv',
        lines: [
          {
            text: 'example',
            number: 1234,
            hex: '1234567890abcdef1234567890abcdef'
          }
        ]
      })
    })

    it('should return a 404 error if the file is not found in the external API', async () => {
      axios.get.mockRejectedValue({ response: { status: 404 } })

      const res = await request(app).get('/file/nonexistent.csv')

      expect(res.statusCode).toEqual(404)
      expect(res.body).toHaveProperty('error', 'File not found')
    })

    it('should return a 500 error if there is an error downloading the file', async () => {
      axios.get.mockRejectedValue(new Error('External API Error'))

      const res = await request(app).get('/file/test1.csv')

      expect(res.statusCode).toEqual(500)
      expect(res.body).toHaveProperty('error', 'Failed to download file from external API')
    })

    it('should skip invalid lines in the CSV content', async () => {
      const mockFileContent = `file,text,number,hex
test1.csv,data,5678,abcdefabcdefabcdefabcdefabcdefab
invalid,line
another,missing,data
test1.csv,data2,91011,invalidhexvalue`
      axios.get.mockResolvedValue({ data: mockFileContent })

      const res = await request(app).get('/file/test1.csv')

      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({
        file: 'test1.csv',
        lines: [
          {
            text: 'data',
            number: 5678,
            hex: 'abcdefabcdefabcdefabcdefabcdefab'
          }
        ]
      })
    })
  })

  describe('GET /files/data', () => {
    it('should fetch and aggregate data from all available files', async () => {
      axios.get
        .mockResolvedValueOnce({ data: { files: ['test1.csv', 'test2.csv'] } })
        .mockResolvedValueOnce({
          data: 'file,text,number,hex\ntest1.csv,data1,123,1234567890abcdef1234567890abcdef'
        })
        .mockResolvedValueOnce({
          data: 'file,text,number,hex\ntest2.csv,data2,456,abcdefabcdefabcdefabcdefabcdefab'
        })

      const res = await request(app).get('/files/data')

      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual([
        {
          file: 'test1.csv',
          lines: [
            {
              text: 'data1',
              number: 123,
              hex: '1234567890abcdef1234567890abcdef'
            }
          ]
        },
        {
          file: 'test2.csv',
          lines: [
            {
              text: 'data2',
              number: 456,
              hex: 'abcdefabcdefabcdefabcdefabcdefab'
            }
          ]
        }
      ])
    })

    it('should skip files that cannot be found or fetched', async () => {
      axios.get
        .mockResolvedValueOnce({ data: { files: ['test1.csv', 'nonexistent.csv'] } })
        .mockResolvedValueOnce({
          data: 'file,text,number,hex\ntest1.csv,data1,123,1234567890abcdef1234567890abcdef'
        })
        .mockRejectedValueOnce({ response: { status: 404 } })

      const res = await request(app).get('/files/data')

      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual([
        {
          file: 'test1.csv',
          lines: [
            {
              text: 'data1',
              number: 123,
              hex: '1234567890abcdef1234567890abcdef'
            }
          ]
        }
      ])
    })
  })
})

module.exports = app
