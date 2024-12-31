var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// model.js
const axios = require('axios');
const Papa = require('papaparse');
const { DateTime } = require('luxon');
const { MongoClient } = require('mongodb');
const MONGODB_URI = "mongodb://127.0.0.1/"; // Replace with your MongoDB URI
const DB_NAME = 'FinanceDB';
const COLLECTION_NAME = 'commodities';
// Define URLs for fetching commodity data
const COMMODITY_URLS = {
    'Gold': 'https://query1.finance.yahoo.com/v7/finance/download/GC=F?period1=0&period2=9999999999&interval=1d&events=history',
    'Silver': 'https://query1.finance.yahoo.com/v7/finance/download/SI=F?period1=0&period2=9999999999&interval=1d&events=history',
    'Oil': 'https://query1.finance.yahoo.com/v7/finance/download/CL=F?period1=0&period2=9999999999&interval=1d&events=history',
    'Natural Gas': 'https://query1.finance.yahoo.com/v7/finance/download/NG=F?period1=0&period2=9999999999&interval=1d&events=history',
    'Platinum': 'https://query1.finance.yahoo.com/v7/finance/download/PL=F?period1=0&period2=9999999999&interval=1d&events=history'
};
// Fetch data from a given URL and parse it
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(url);
            const data = Papa.parse(response.data, { header: true });
            return data.data.map(row => ({
                Date: DateTime.fromISO(row.Date).toJSDate(),
                Commodity_Price: parseFloat(row.Close)
            }));
        }
        catch (error) {
            throw new Error(`Error fetching data from ${url}: ${error.message}`);
        }
    });
}
// Calculate volatility of commodity prices
function calculateVolatility(data, window = 30) {
    const priceReturns = data.map((row, index) => {
        if (index === 0)
            return Object.assign(Object.assign({}, row), { Price_Return: 0 });
        const priceReturn = (row.Commodity_Price - data[index - 1].Commodity_Price) / data[index - 1].Commodity_Price;
        return Object.assign(Object.assign({}, row), { Price_Return: priceReturn });
    });
    return priceReturns.map((row, index) => {
        if (index < window)
            return Object.assign(Object.assign({}, row), { Volatility: 0 });
        const windowData = priceReturns.slice(index - window, index);
        const volatility = Math.sqrt(windowData.reduce((acc, curr) => acc + Math.pow(curr.Price_Return, 2), 0) / window);
        return Object.assign(Object.assign({}, row), { Volatility: volatility });
    });
}
// Update data in MongoDB
function updateData() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            yield client.connect();
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTION_NAME);
            for (const [name, url] of Object.entries(COMMODITY_URLS)) {
                let data = yield fetchData(url);
                data = calculateVolatility(data);
                yield collection.updateOne({ name: name }, { $set: { name: name, data: data } }, { upsert: true });
            }
            console.log('Data updated successfully');
        }
        catch (error) {
            console.error(`Error updating data: ${error.message}`);
        }
        finally {
            yield client.close();
        }
    });
}
// Retrieve commodity data by name
function getCommodityData(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            yield client.connect();
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTION_NAME);
            const result = yield collection.findOne({ name: name });
            return result ? result.data : [];
        }
        catch (error) {
            console.error(`Error fetching data: ${error.message}`);
            return [];
        }
        finally {
            yield client.close();
        }
    });
}
module.exports = { updateData, getCommodityData };
//# sourceMappingURL=CompriceModel.js.map