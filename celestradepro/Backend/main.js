module.exports = function(app, MongoClient, mongoUrl, dbName) {
  // Endpoint to fetch data from MongoDB
  app.get('/api/analystic', async (req, res) => {
    try {
      const client = await MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
      const db = client.db(dbName);
      // Assuming collection name is 'analyst'
      const collection = db.collection('analyst');
      const data = await collection.find({}).toArray();
      res.json(data);
      client.close();
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
};
