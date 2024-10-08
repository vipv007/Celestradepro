const { MongoClient } = require("mongodb");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

// MongoDB connection URL and Database Name
//const MONGODB_URI = "mongodb://celes-mon-db:Rzp7AmNbss2332G6A6UrumqPhABRvdaOAINjpd2L4kvQ2Ycj7RFxMxcspvB4qnPO1knuW2EkpMcbjspM3aI6sg%3D%3D@celes-mon-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celes-mon-db@";
//const DB_NAME = "test";

const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = "FinanceDB";
const COLLECTION_NAME = "StrikePegger";

// Base URL and Symbols to fetch data for
const BASE_URL = "https://www.optionistics.com/quotes/strike-pegger";
const SYMBOLS = ["AAPL", "AMZN", "GOOG", "MSFT", "TSLA"];

async function fetchAndStoreStrikePeggerData(symbol, expirationDate) {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        // Connect to MongoDB
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Launch Puppeteer browser
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Set user agent and other headers if necessary
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Navigate to the URL with the symbol and expiration date as query parameters
        await page.goto(`${BASE_URL}?symbol=${symbol}&expiry=${expirationDate}`, { waitUntil: 'networkidle2' });

        // Get the page content
        const html = await page.content();
        const $ = cheerio.load(html);

        // Extract the necessary data from the HTML
        const strikePeggerData = { symbol, expirationDate };

        // Extract fields
        const extractTableData = (selector, dataKey) => {
            const value = $(selector).closest('td').next().text().trim();
            strikePeggerData[dataKey] = value;
        };

        extractTableData('td:contains("HIGH")', 'high');
        extractTableData('td:contains("LOW")', 'low');
        extractTableData('td:contains("DIVIDEND DATE")', 'dividend_date');
        extractTableData('td:contains("OPEN")', 'open');
        extractTableData('td:contains("CLOSE")', 'close');
        extractTableData('td:contains("DIVIDEND AMOUNT")', 'dividend_amount');
        extractTableData('td:contains("BID")', 'bid');
        extractTableData('td:contains("ASK")', 'ask');
        extractTableData('td:contains("YIELD")', 'yield');
        extractTableData('td:contains("VOLUME")', 'volume');
        extractTableData('td:contains("SPLIT DATE")', 'split_date');
        extractTableData('td:contains("DATE/TIME:")', 'date_time');
        extractTableData('td:contains("OPTION VOLUME")', 'option_volume');
        extractTableData('td:contains("IMPLIED VOLATILITY")', 'implied_volatility');
        extractTableData('td:contains("HISTORICAL VOL")', 'historical_vol');

        // Extract full name
        strikePeggerData.full_name = $("span:contains('AMAZON.COM INC')").text().trim();

        // Store the data in MongoDB
        await collection.insertOne(strikePeggerData);
        console.log(`Data for ${symbol} with expiration date ${expirationDate} stored successfully!`);

        // Close Puppeteer browser
        await browser.close();
    } catch (error) {
        console.error(`Error fetching or storing data for ${symbol}:`, error.message);
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
}

async function fetchAndStoreDataForAllSymbols() {
    for (const symbol of SYMBOLS) {
        // Fetch the available expiration dates for the symbol
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        await page.goto(`${BASE_URL}?symbol=${symbol}`, { waitUntil: 'networkidle2' });

        const html = await page.content();
        const $ = cheerio.load(html);
        const expirationDates = [];
        $("select[name='expiry'] option").each((i, el) => {
            expirationDates.push($(el).val());
        });

        await browser.close();

        // Fetch and store data for each expiration date
        for (const expirationDate of expirationDates) {
            await fetchAndStoreStrikePeggerData(symbol, expirationDate);
        }
    }
}

// Run the function to fetch and store data for all symbols
fetchAndStoreDataForAllSymbols();
