const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 4000;

const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = 'FinanceDB';
const COLLECTION_NAME = 'comprice';

app.use(cors());

app.get('/api/commodities', async (req, res) => {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    const commoditiesData = await collection.find({}).toArray();
    res.json(commoditiesData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  } finally {
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
