var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { MongoClient } = require('mongodb');
const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = "FinanceDB";
const COLLECTION_NAME = "StrikePegger";
function fetchData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { symbol, date } = req.query;
        const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            yield client.connect();
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTION_NAME);
            const query = { symbol, expirationDate: date };
            const data = yield collection.find(query).toArray();
            res.status(200).json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        finally {
            yield client.close();
        }
    });
}
function fetchAvailableDates(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { symbol } = req.query;
        const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            yield client.connect();
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTION_NAME);
            const dates = yield collection.distinct('expirationDate', { symbol });
            res.status(200).json(dates);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
        finally {
            yield client.close();
        }
    });
}
module.exports = {
    fetchData,
    fetchAvailableDates
};
//# sourceMappingURL=peggerController.js.map