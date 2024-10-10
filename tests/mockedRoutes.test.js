// tests/mockedRoutes.test.js
const request = require('supertest')
const express = require('express')
const mockedRoutes = require('../routes/mockedRoutes')

const app = express()
app.use('/mocked', mockedRoutes)

describe('Mocked API Routes', () => {
  describe('GET /mocked/files', () => {
    it('should fetch a list of available files (mocked)', async () => {
      const res = await request(app).get('/mocked/files')

      expect(res.statusCode).toEqual(200)
      expect(res.body).toEqual({ files: ['file1.csv', 'file2.csv', 'file3.csv'] })
    })
  })

  describe('GET /mocked/file/:name', () => {
    it('should download a specific mocked file', async () => {
      const res = await request(app).get('/mocked/file/file1.csv')

      expect(res.statusCode).toEqual(200)
      expect(res.text).toContain('file1.csv')
    })

    it('should return a 404 error if the mocked file is not found', async () => {
      const res = await request(app).get('/mocked/file/nonexistent.csv')

      expect(res.statusCode).toEqual(404)
      expect(res.body).toHaveProperty('error', 'File not found')
    })
  })
})

module.exports = app
