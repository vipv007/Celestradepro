const { MongoClient } = require('mongodb');

const uri = "mongodb://127.0.0.1/";
const dbName = 'FinanceDB';
const collectionName = 'movingave';

const fetchMovingAverages = async (commodity) => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return await collection.find({ commodity }).toArray();
  } catch (error) {
    throw new Error('Error fetching data: ' + error.message);
  } finally {
    await client.close();
  }
};

module.exports = {
  fetchMovingAverages,
};
