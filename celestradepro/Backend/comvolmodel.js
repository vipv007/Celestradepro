const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = 'FinanceDB';
const COLLECTION_NAME = 'comprice';

const fetchAllCommodities = async () => {
  const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);
    return await collection.find({}).toArray();
  } catch (error) {
    throw new Error('Error fetching data: ' + error.message);
  } finally {
    await client.close();
  }
};

module.exports = {
  fetchAllCommodities,
};
