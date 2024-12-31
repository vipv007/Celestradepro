var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    "https://www.investopedia.com/",
    "https://www.nasdaq.com/market-activity/commodities",
    "https://www.livemint.com/",
    "https://finance.yahoo.com/",
];
// Function to connect to MongoDB
function connectToDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new MongoClient(MONGODB_URI);
        yield client.connect();
        return client;
    });
}
// Function to fetch sub-URLs from a main URL
function fetchSubUrlsFromMainUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Fetching sub-URLs from:", url);
            const response = yield axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            const subUrls = [];
            $("a").each((index, element) => {
                const subUrl = $(element).attr("href");
                if (subUrl &&
                    !subUrl.startsWith("#") &&
                    !subUrl.startsWith("javascript") &&
                    (subUrl.includes("bloomberg.com") || subUrl.includes("stock") || subUrl.includes("finance") || subUrl.includes("market"))) {
                    const fullUrl = new URL(subUrl, url).href; // Ensure it's a full URL
                    subUrls.push(fullUrl);
                }
            });
            console.log("Found", subUrls.length, "sub-URLs from", url);
            return subUrls;
        }
        catch (error) {
            console.error("Error fetching sub-URLs from", url, ":", error.message);
            yield storeMainUrlErrorInDb(url, "Please see the site for more details.");
            return [];
        }
    });
}
// Function to convert the posted time to IST with AM/PM format
function convertToIST(dateTime) {
    const options = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    };
    return new Date(dateTime).toLocaleString("en-IN", options);
}
// Function to fetch, summarize, and store data from a sub-URL
function processSubUrl(subUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Processing sub-URL:", subUrl);
            const response = yield axios.get(subUrl);
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
            // Extract the posted time from the article
            const postedTime = $("time").attr("datetime") || $("meta[property='article:published_time']").attr("content");
            const articleDateTime = postedTime ? convertToIST(postedTime) : convertToIST(new Date());
            // Extract image URL related to the news article
            const imageUrl = $("meta[property='og:image']").attr("content") || $("img").first().attr("src") || null;
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = yield genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });
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
            const result = yield model.generateContent({
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
            // Store only if meaningful content is available
            yield storeFetchedDetailsInDb({
                url: subUrl,
                headline: $("title").text(),
                mainPoints: mainPoints,
                articleText: articleText,
                summary: result.response.text(),
                sentimentScore: sentimentScoreNormalized.toFixed(2),
                sentiment: sentimentLabel,
                articleDateTime: articleDateTime,
                imageUrl: imageUrl // Include the extracted image URL
            });
        }
        catch (error) {
            console.error("Error processing sub-URL:", error.message);
            // Do not store error messages for sub-URLs
        }
    });
}
// Function to store an error message for a main URL in the database
function storeMainUrlErrorInDb(url, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDb();
        const db = client.db(DB_NAME);
        const collection = db.collection("com_news");
        const existingNews = yield collection.findOne({ url: url });
        if (!existingNews) {
            yield collection.insertOne({
                url: url,
                headline: url,
                mainPoints: ["N/A"],
                articleText: "N/A",
                summary: message,
                sentimentScore: "N/A",
                sentiment: "N/A",
                articleDateTime: convertToIST(new Date())
            });
            console.log("Stored main URL error message in MongoDB.");
        }
        else {
            console.log("Main URL error already exists in the database. Skipping storage.");
        }
        yield client.close();
    });
}
// Function to store fetched details in the database
function storeFetchedDetailsInDb(details) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDb();
        const db = client.db(DB_NAME);
        const collection = db.collection("com_news");
        const existingNews = yield collection.findOne({ url: details.url });
        if (!existingNews) {
            yield collection.insertOne(details);
            console.log("Fetched details stored in MongoDB.");
        }
        else {
            console.log("News already exists in the database. Skipping storage.");
        }
        yield client.close();
    });
}
// Function to summarize multiple main URLs
function summarizeMultipleMainUrls() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const url of MAIN_URLS) {
            const subUrls = yield fetchSubUrlsFromMainUrl(url);
            const processPromises = subUrls.map(subUrl => processSubUrl(subUrl));
            yield Promise.all(processPromises);
        }
    });
}
summarizeMultipleMainUrls();
//# sourceMappingURL=com_news.js.map