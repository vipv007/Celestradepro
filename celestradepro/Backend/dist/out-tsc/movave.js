var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const yahooFinance = require('yahoo-finance2').default;
const { MongoClient } = require('mongodb');
const { SMA, EMA } = require('technicalindicators');
// MongoDB connection URI and database/collection names
const uri = "mongodb://celes-mon-db:Rzp7AmNbss2332G6A6UrumqPhABRvdaOAINjpd2L4kvQ2Ycj7RFxMxcspvB4qnPO1knuW2EkpMcbjspM3aI6sg%3D%3D@celes-mon-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celes-mon-db@";
const dbName = 'test';
const collectionName = 'movingave';
// MongoDB client
const client = new MongoClient(uri);
// Fetch historical data and calculate moving averages for multiple commodities
function fetchAndStoreData(symbols) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect to MongoDB
            yield client.connect();
            console.log('Connected to MongoDB');
            // Process each symbol
            for (const symbol of symbols) {
                console.log(`Fetching data for ${symbol}...`);
                // Fetch historical data
                const result = yield yahooFinance.historical(symbol, {
                    period1: '2024-01-01', // Start date (YYYY-MM-DD)
                    period2: '2024-06-30', // End date (YYYY-MM-DD)
                    interval: '1d' // Daily data
                });
                // Extract closing prices and dates
                const closePrices = result.map(entry => entry.close);
                const dates = result.map(entry => entry.date);
                // Calculate moving averages
                const sma20 = SMA.calculate({ period: 20, values: closePrices });
                const ema20 = EMA.calculate({ period: 20, values: closePrices });
                // Store data in MongoDB
                const db = client.db(dbName);
                const collection = db.collection(collectionName);
                // Prepare documents for insertion with commodity field
                const documents = [];
                for (let i = 19; i < dates.length; i++) { // 20-day SMA/EMA starts from the 20th element
                    documents.push({
                        date: dates[i],
                        sma20: sma20[i - 19],
                        ema20: ema20[i - 19],
                        commodity: symbol // Add the commodity field
                    });
                }
                yield collection.insertMany(documents);
                console.log(`Data for ${symbol} stored in MongoDB`);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            // Close MongoDB connection
            yield client.close();
            console.log('MongoDB connection closed');
        }
    });
}
// Example usage with multiple commodities
fetchAndStoreData(['CL=F', 'NG=F', 'SI=F', 'HG=F', 'ZC=F', 'PL=F']);
//# sourceMappingURL=movave.js.map