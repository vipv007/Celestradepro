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
// Configuration
const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = "FinanceDB";
const API_KEY = "AIzaSyBzfYWVF3kbttQfwzzWKBhPQtZe6teGSZU"; // Replace with your actual Google API Key
const MAIN_URLS = [
    "https://www.fxstreet.com/",
    "https://www.forexfactory.com/",
    "https://www.dailyfx.com/",
    "https://in.investing.com/news/forex-news",
    "https://www.myfxbook.com/news"
];
const forexKeywords = [
    "forex", "currency", "exchange rate", "FX", "forex trading",
    "forex market", "foreign exchange", "forex news", "forex analysis",
    "forex forecast", "currency pair", "currency trading", "forex strategy",
    "forex broker", "forex signals", "forex volatility"
];
// Function to connect to MongoDB
function connectToDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new MongoClient(MONGODB_URI);
        yield client.connect();
        return client;
    });
}
// Function to fetch news URLs from the main link for specified topics
function fetchNewsUrls(mainUrls, keywords) {
    return __awaiter(this, void 0, void 0, function* () {
        const newsUrls = [];
        const promises = [];
        const axiosConfig = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };
        for (const mainUrl of mainUrls) {
            try {
                console.log("Fetching news URLs from:", mainUrl);
                const response = yield axios.get(mainUrl, axiosConfig);
                const html = response.data;
                const $ = cheerio.load(html);
                $("a").each((index, element) => {
                    const url = $(element).attr("href");
                    if (url && !url.startsWith("#") && !url.startsWith("javascript")) {
                        const fullUrl = new URL(url, mainUrl).href;
                        promises.push(fetchAndProcessNews(fullUrl, axiosConfig, mainUrl));
                    }
                });
            }
            catch (error) {
                console.error("Error fetching news URLs from", mainUrl, ":", error.message);
                yield storeMainUrlErrorInDb(mainUrl, "Please see the site for more details.");
            }
        }
        yield Promise.all(promises);
        return newsUrls;
    });
}
// Helper function to fetch news content and process it
function fetchAndProcessNews(fullUrl, axiosConfig, mainUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(fullUrl, axiosConfig);
            const html = response.data;
            const $ = cheerio.load(html);
            const articleText = $("article").text();
            const mainPoints = $("article").find("h2").length;
            if (mainPoints > 0 && articleText.length > 0) {
                const headline = $("title").text();
                const imageUrl = $("meta[property='og:image']").attr("content") || $("img").first().attr("src");
                newsUrls.push({ url: fullUrl, headline, imageUrl });
            }
        }
        catch (error) {
            console.error("Error fetching URL:", fullUrl, "-", error.message);
        }
    });
}
// Function to fetch, summarize, and store data from a sub-URL
function processSubUrl(newsData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { url, headline, imageUrl } = newsData;
        try {
            console.log("Fetching news content from URL:", url);
            const response = yield axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            const articleText = $("article").text();
            const isPremium = articleText.includes("subscribe") || articleText.includes("premium");
            if (!articleText || isPremium) {
                console.log("Content is behind a paywall or not available. Skipping storage.");
                return;
            }
            const mainPoints = [];
            $("article").find("h2").each((index, element) => {
                mainPoints.push($(element).text());
            });
            const articleDateTime = $("time").attr("datetime") || $("meta[property='article:published_time']").attr("content");
            if (!articleDateTime) {
                console.log("No article date and time found.");
                return;
            }
            const articleDate = new Date(articleDateTime);
            const istOffset = 5 * 60 + 30;
            const istDate = new Date(articleDate.getTime() + istOffset * 60000);
            const istDateTimeString = istDate.toLocaleString('en-IN', { hour12: true });
            console.log("Article Date and Time (IST):", istDateTimeString);
            console.log("Main points of the news article:", mainPoints);
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
            yield storeFetchedDetailsInDb({
                url,
                headline,
                mainPoints,
                articleText,
                imageUrl,
                summary: result.response.text(),
                sentimentScore: sentimentScoreNormalized.toFixed(2),
                sentiment: sentimentLabel,
                articleDateTime: istDateTimeString
            });
        }
        catch (error) {
            console.error("Error fetching or summarizing news:", error.message);
        }
    });
}
// Function to store an error message for a main URL in the database
function storeMainUrlErrorInDb(url, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDb();
        const db = client.db(DB_NAME);
        const collection = db.collection("Fx_news");
        const existingNews = yield collection.findOne({ url });
        if (!existingNews) {
            yield collection.insertOne({
                url,
                headline: url,
                mainPoints: ["N/A"],
                articleText: "N/A",
                summary: message,
                sentimentScore: "N/A",
                sentiment: "N/A"
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
        const collection = db.collection("Fx_news");
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
        const newsUrls = yield fetchNewsUrls(MAIN_URLS, forexKeywords);
        if (newsUrls.length === 0) {
            console.log("No relevant news URLs found. Fetching general news articles.");
            for (const mainUrl of MAIN_URLS) {
                const newsData = { url: mainUrl, headline: `General news from ${mainUrl}` };
                yield processSubUrl(newsData);
            }
            return;
        }
        console.log("Found", newsUrls.length, "relevant news URLs.");
        for (const newsData of newsUrls) {
            yield processSubUrl(newsData);
        }
    });
}
// Start the summarization process with the forexKeywords
summarizeMultipleMainUrls();
//# sourceMappingURL=fx_news.js.map