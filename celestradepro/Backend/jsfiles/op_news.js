const { MongoClient } = require("mongodb");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const axios = require("axios");
const cheerio = require("cheerio");
const Sentiment = require("sentiment");

// MongoDB connection URL and Database Name
const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = "FinanceDB";

// Google API Key
const API_KEY = "AIzaSyBzfYWVF3kbttQfwzzWKBhPQtZe6teGSZU"; // Replace with your actual Google API Key

// Main URLs to fetch news from
const MAIN_URLS = [
    "https://www.cnbc.com/options-action/",
    "https://www.investors.com/category/research/options/",
    "https://www.marketwatch.com/investing/options",
    "https://www.benzinga.com/markets/options",
    "https://theoptionsinsider.com/options-news/",
    "https://www.schwab.com/learn/story/todays-options-market-update"
];

// Keywords for options trading-related news
const optionsTradingKeywords = [
    "options trading", "options market", "call option", "put option", "options strategy",
    "options volatility", "options premium", "derivatives", "options contracts",
    "options pricing", "options analysis", "options forecast"
];

// Function to connect to MongoDB
async function connectToDb() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    return client;
}

// Function to fetch sub-URLs from a main URL
async function fetchSubUrlsFromMainUrl(url) {
    try {
        console.log("Fetching sub-URLs from:", url);
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const subUrls = [];
        $("a").each((index, element) => {
            const subUrl = $(element).attr("href");
            if (subUrl && !subUrl.startsWith("#") && !subUrl.startsWith("javascript")) {
                const fullUrl = new URL(subUrl, url).href; // Ensure it's a full URL
                subUrls.push(fullUrl);
            }
        });

        console.log("Found", subUrls.length, "sub-URLs from", url);
        return subUrls;
    } catch (error) {
        console.error("Error fetching sub-URLs from", url, ":", error.message);
        return [];
    }
}

// Function to check if the content of a URL is relevant to the keywords
async function isRelevantContent(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const articleText = $("article").text().toLowerCase();

        // Check for relevance based on keywords
        return optionsTradingKeywords.some(keyword => articleText.includes(keyword));
    } catch (error) {
        console.error("Error checking relevance for URL:", url, "-", error.message);
        return false;
    }
}

// Function to fetch, summarize, and store data from a sub-URL
async function processSubUrl(subUrl) {
    try {
        console.log("Processing sub-URL:", subUrl);
        const response = await axios.get(subUrl);
        const html = response.data;
        const $ = cheerio.load(html);

        const articleText = $("article").text();
        const isPremium = articleText.includes("subscribe") || articleText.includes("premium");

        if (!articleText || isPremium) {
            console.log("Content is behind a paywall or not available. Skipping storage.");
            return; // Skip storing this URL
        }

        const mainPoints = [];
        $("article").find("h2").each((index, element) => {
            mainPoints.push($(element).text());
        });

        console.log("Main points of the news article:", mainPoints);

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = await genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });

        if (!model) {
            throw new Error("Failed to fetch the generative model.");
        }

        const generationConfig = {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 512,
        };

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const parts = [
            { text: mainPoints.join(". ") },
            { text: articleText }
        ];

        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });

        const sentiment = new Sentiment();
        const analysis = sentiment.analyze(result.response.text());
        let sentimentScore = analysis.score;

        const normalizedScore = (sentimentScore + 5) / 2;
        const sentimentScoreNormalized = Math.max(1, Math.min(normalizedScore, 10));

        const sentimentLabel = sentimentScoreNormalized >= 5 ? "Positive" : "Negative";

        console.log("Summary of the main points and article text:");
        console.log(result.response.text());
        console.log("Sentiment analysis score:", sentimentScoreNormalized.toFixed(2), "/ 10");
        console.log("Sentiment:", sentimentLabel);

        // Store fetched details in the database
        await storeFetchedDetailsInDb({
            url: subUrl,
            headline: $("title").text(),
            mainPoints: mainPoints,
            articleText: articleText,
            summary: result.response.text(),
            sentimentScore: sentimentScoreNormalized.toFixed(2),
            sentiment: sentimentLabel,
            fetchedTime: new Date()
        });

    } catch (error) {
        console.error("Error processing sub-URL:", error.message);
    }
}

// Function to store a main URL record with a "see the site" message
async function storeMainUrlWithMessage(url, message) {
    const client = await connectToDb();
    const db = client.db(DB_NAME);
    const collection = db.collection("op_news");

    await collection.updateOne(
        { url: url },
        {
            $set: {
                url: url,
                headline: url,
                mainPoints: ["N/A"],
                articleText: "N/A",
                summary: message,
                sentimentScore: "N/A",
                sentiment: "N/A",
                fetchedTime: new Date()
            }
        },
        { upsert: true }
    );

    console.log("Stored main URL with message in MongoDB.");
    await client.close();
}

// Function to store fetched details in the database
async function storeFetchedDetailsInDb(details) {
    const client = await connectToDb();
    const db = client.db(DB_NAME);
    const collection = db.collection("op_news");

    const existingNews = await collection.findOne({ url: details.url });

    if (!existingNews) {
        await collection.insertOne(details);
        console.log("Fetched details stored in MongoDB.");
    } else {
        console.log("News already exists in the database. Skipping storage.");
    }

    await client.close();
}

// Function to summarize and process multiple main URLs
async function summarizeMultipleMainUrls() {
    for (const url of MAIN_URLS) {
        const subUrls = await fetchSubUrlsFromMainUrl(url);

        // Filter sub-URLs to include only those relevant
        const relevantSubUrls = [];
        for (const subUrl of subUrls) {
            if (await isRelevantContent(subUrl)) {
                relevantSubUrls.push(subUrl);
            }
        }

        if (relevantSubUrls.length > 0) {
            const processPromises = relevantSubUrls.map(subUrl => processSubUrl(subUrl));
            await Promise.all(processPromises);
        } else {
            await storeMainUrlWithMessage(url, "Please see the site for more details.");
        }
    }
}

// Start the summarization process
summarizeMultipleMainUrls()
    .then(() => {
        console.log("Summarization process complete.");
        process.exit(0); // Stop the terminal after completing the fetching and summarization
    })
    .catch(error => {
        console.error("Error during summarization process:", error.message);
        process.exit(1); // Exit with error status
    });
