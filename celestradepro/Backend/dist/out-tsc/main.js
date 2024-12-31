var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = function (app, MongoClient, mongoUrl, dbName) {
    // Endpoint to fetch data from MongoDB
    app.get('/api/analystic', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield MongoClient.connect(mongoUrl, { useUnifiedTopology: true });
            const db = client.db(dbName);
            // Assuming collection name is 'analyst'
            const collection = db.collection('analyst');
            const data = yield collection.find({}).toArray();
            res.json(data);
            client.close();
        }
        catch (error) {
            console.error('Error fetching data:', error);
            res.status(500).json({ error: 'An error occurred' });
        }
    }));
};
//# sourceMappingURL=main.js.map