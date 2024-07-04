const express = require('express');
const { MongoClient } = require('mongodb');

const router = express.Router();

// Connection URI
const uri = 'mongodb://127.0.0.1';
const client = new MongoClient(uri);

// Connect to MongoDB and fetch data from the "com_prof" collection
client.connect(async err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }

  const db = client.db('FinanceDB');
  const collection = db.collection('com_prof');

  // Define a route to fetch data from the "com_prof" collection
  router.get('/', async (req, res) => {
    try {
      const data = await collection.find({}).toArray();
      res.json(data);
    } catch (error) {
      console.error('Error fetching data from the collection:', error);
      res.status(500).send('Internal Server Error');
    }
  });
});

module.exports = router;
