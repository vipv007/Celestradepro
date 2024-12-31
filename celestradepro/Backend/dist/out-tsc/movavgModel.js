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
const uri = "mongodb://127.0.0.1/";
const dbName = 'FinanceDB';
const collectionName = 'movingave';
const fetchMovingAverages = (commodity) => __awaiter(this, void 0, void 0, function* () {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        yield client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        return yield collection.find({ commodity }).toArray();
    }
    catch (error) {
        throw new Error('Error fetching data: ' + error.message);
    }
    finally {
        yield client.close();
    }
});
module.exports = {
    fetchMovingAverages,
};
//# sourceMappingURL=movavgModel.js.map