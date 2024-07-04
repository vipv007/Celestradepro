const { MongoClient } = require('mongodb');

const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = "FinanceDB";
const COLLECTION_NAME = "StrikePegger";

async function fetchData(req, res) {
    const { symbol, date } = req.query;
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const query = { symbol, expirationDate: date };
        const data = await collection.find(query).toArray();

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
}

async function fetchAvailableDates(req, res) {
    const { symbol } = req.query;
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        const dates = await collection.distinct('expirationDate', { symbol });

        res.status(200).json(dates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await client.close();
    }
}

module.exports = {
    fetchData,
    fetchAvailableDates
};
