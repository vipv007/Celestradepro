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
const DB_NAME = 'FinanceDB';
const COLLECTION_NAME = 'comprice';
const fetchAllCommodities = () => __awaiter(this, void 0, void 0, function* () {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        yield client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        return yield collection.find({}).toArray();
    }
    catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
    finally {
        yield client.close();
    }
});
module.exports = {
    fetchAllCommodities,
};
//# sourceMappingURL=comvolmodel.js.map