var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 5000;
// MongoDB connection URI and database/collection names
// const uri = "mongodb://celes-mon-db:Rzp7AmNbss2332G6A6UrumqPhABRvdaOAINjpd2L4kvQ2Ycj7RFxMxcspvB4qnPO1knuW2EkpMcbjspM3aI6sg%3D%3D@celes-mon-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celes-mon-db@";
// const dbName = 'test';
const collectionName = 'movingave';
// MongoDB client
const client = new MongoClient(uri);
app.use(cors());
app.use(express.json());
// API endpoint to fetch data for frontend
app.get('/api/moving-averages/:commodity', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const commodity = req.params.commodity;
        const data = yield collection.find({ commodity }).toArray();
        res.json(data);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
    finally {
        yield client.close();
    }
}));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
//# sourceMappingURL=co_mov.js.map