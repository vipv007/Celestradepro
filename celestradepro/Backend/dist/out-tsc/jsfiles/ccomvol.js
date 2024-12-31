var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const axios = require('axios');
const Papa = require('papaparse');
const { Chart } = require('chart.js');
const { DateTime } = require('luxon');
const { MongoClient } = require('mongodb');
// Define public URLs for CSV files of multiple commodities
const COMMODITY_URLS = {
    'Gold': 'https://query1.finance.yahoo.com/v7/finance/download/GC=F?period1=0&period2=9999999999&interval=1d&events=history',
    'Silver': 'https://query1.finance.yahoo.com/v7/finance/download/SI=F?period1=0&period2=9999999999&interval=1d&events=history',
    'Oil': 'https://query1.finance.yahoo.com/v7/finance/download/CL=F?period1=0&period2=9999999999&interval=1d&events=history',
    'Natural Gas': 'https://query1.finance.yahoo.com/v7/finance/download/NG=F?period1=0&period2=9999999999&interval=1d&events=history',
    'Platinum': 'https://query1.finance.yahoo.com/v7/finance/download/PL=F?period1=0&period2=9999999999&interval=1d&events=history'
};
//const MONGODB_URI = "mongodb://celes-mon-db:Rzp7AmNbss2332G6A6UrumqPhABRvdaOAINjpd2L4kvQ2Ycj7RFxMxcspvB4qnPO1knuW2EkpMcbjspM3aI6sg%3D%3D@celes-mon-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celes-mon-db@"; // Replace with your MongoDB URI
//const DB_NAME = 'test';
const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = "FinanceDB";
const COLLECTION_NAME = 'comprice';
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(url);
            const data = Papa.parse(response.data, { header: true });
            console.log(`Columns in fetched data: ${Object.keys(data.data[0])}`); // Print column names for inspection
            return data.data.map(row => ({
                Date: DateTime.fromISO(row.Date).toJSDate(),
                Commodity_Price: parseFloat(row.Close)
            }));
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    });
}
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
function printData(commoditiesData) {
    for (const [name, data] of Object.entries(commoditiesData)) {
        console.log(`\n${name} Data:`);
        console.table(data.slice(-10)); // Print the last 10 rows of the data for brevity
    }
}
function plotVolatility(commoditiesData) {
    const ctx = document.getElementById('volatilityChart').getContext('2d');
    const datasets = Object.entries(commoditiesData).map(([name, data]) => ({
        label: name,
        data: data.map(row => ({ x: row.Date, y: row.Volatility })),
        borderColor: getRandomColor(),
        fill: false
    }));
    new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            title: {
                display: true,
                text: 'Commodity Price Volatility'
            },
            scales: {
                xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month'
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Volatility'
                        }
                    }]
            }
        }
    });
}
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            yield client.connect();
            const db = client.db(DB_NAME);
            const collection = db.collection(COLLECTION_NAME);
            const commoditiesData = {};
            for (const [name, url] of Object.entries(COMMODITY_URLS)) {
                console.log(`Fetching data for ${name}...`);
                let data = yield fetchData(url);
                data = calculateVolatility(data);
                commoditiesData[name] = data;
                // Store data in MongoDB
                yield collection.updateOne({ name: name }, { $set: { name: name, data: data } }, { upsert: true });
            }
            printData(commoditiesData);
            plotVolatility(commoditiesData);
        }
        catch (error) {
            console.error('Error connecting to MongoDB:', error);
        }
        finally {
            yield client.close();
        }
    });
}
main();
//# sourceMappingURL=ccomvol.js.map