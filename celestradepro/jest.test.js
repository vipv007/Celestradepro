const request = require('supertest');
const express = require('express');
const server = express();

server.get('/hello', (req, res) => {
  res.status(200).send('Hello world');
});

describe('GET /hello', () => {
  it('responds with status 200 and "Hello world"', async () => {
    const response = await request(server).get('/hello');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello world');
  });
});
