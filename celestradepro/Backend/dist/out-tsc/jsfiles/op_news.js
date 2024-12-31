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
// Configuration Constants
const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = "FinanceDB";
const API_KEY = "AIzaSyBzfYWVF3kbttQfwzzWKBhPQtZe6teGSZU"; // Replace with your actual Google API Key
// Main URLs and Keywords
const MAIN_URLS = [
    "https://www.cnbc.com/options-action/",
    "https://www.investors.com/category/research/options/",
    "https://www.marketwatch.com/investing/options",
    "https://www.benzinga.com/markets/options",
    "https://theoptionsinsider.com/options-news/",
    "https://www.schwab.com/learn/story/todays-options-market-update"
];
const optionsTradingKeywords = [
    "options trading", "options market", "call option", "put option", "options strategy",
    "options volatility", "options premium", "derivatives", "options contracts",
    "options pricing", "options analysis", "options forecast"
];
// Connect to MongoDB
function connectToDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new MongoClient(MONGODB_URI);
        yield client.connect();
        return client;
    });
}
// Convert to IST
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
// Fetch Sub-URLs
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
                if (subUrl && !subUrl.startsWith("#") && !subUrl.startsWith("javascript")) {
                    const fullUrl = new URL(subUrl, url).href; // Ensure it's a full URL
                    subUrls.push(fullUrl);
                }
            });
            console.log("Found", subUrls.length, "sub-URLs from", url);
            return subUrls;
        }
        catch (error) {
            console.error("Error fetching sub-URLs from", url, ":", error.message);
            return [];
        }
    });
}
// Check Content Relevance
function isRelevantContent(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            const articleText = $("article").text().toLowerCase();
            return optionsTradingKeywords.some(keyword => articleText.includes(keyword));
        }
        catch (error) {
            console.error("Error checking relevance for URL:", url, "-", error.message);
            return false;
        }
    });
}
// Fetch Image URL from Article
function fetchImageUrl($) {
    const ogImage = $("meta[property='og:image']").attr("content");
    const twitterImage = $("meta[name='twitter:image']").attr("content");
    const imgTag = $("article img").first().attr("src");
    return ogImage || twitterImage || imgTag || "";
}
// Process Each Sub-URL
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
                return;
            }
            const mainPoints = [];
            $("article").find("h2").each((index, element) => {
                mainPoints.push($(element).text());
            });
            const postedTime = $("time").attr("datetime") || $("meta[property='article:published_time']").attr("content");
            const articleDateTime = postedTime ? convertToIST(postedTime) : convertToIST(new Date());
            const imageUrl = fetchImageUrl($);
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
            const sentimentScore = analysis.score;
            const normalizedScore = (sentimentScore + 5) / 2;
            const sentimentScoreNormalized = Math.max(1, Math.min(normalizedScore, 10));
            const sentimentLabel = sentimentScoreNormalized >= 5 ? "Positive" : "Negative";
            yield storeFetchedDetailsInDb({
                url: subUrl,
                headline: $("title").text(),
                mainPoints: mainPoints,
                articleText: articleText,
                summary: result.response.text(),
                sentimentScore: sentimentScoreNormalized.toFixed(2),
                sentiment: sentimentLabel,
                articleDateTime: articleDateTime,
                imageUrl: imageUrl
            });
        }
        catch (error) {
            console.error("Error processing sub-URL:", error.message);
        }
    });
}
// Store Details in MongoDB
function storeFetchedDetailsInDb(details) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDb();
        const db = client.db(DB_NAME);
        const collection = db.collection("op_news");
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
// Store Message for Main URL
function storeMainUrlWithMessage(url, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield connectToDb();
        const db = client.db(DB_NAME);
        const collection = db.collection("op_news");
        yield collection.updateOne({ url: url }, {
            $set: {
                url: url,
                headline: url,
                mainPoints: ["N/A"],
                articleText: "N/A",
                summary: message,
                sentimentScore: "N/A",
                sentiment: "N/A",
                articleDateTime: convertToIST(new Date()),
                imageUrl: ""
            }
        }, { upsert: true });
        console.log("Stored main URL with message in MongoDB.");
        yield client.close();
    });
}
// Summarize and Process Multiple URLs
function summarizeMultipleMainUrls() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const url of MAIN_URLS) {
            const subUrls = yield fetchSubUrlsFromMainUrl(url);
            const relevantSubUrls = [];
            for (const subUrl of subUrls) {
                if (yield isRelevantContent(subUrl)) {
                    relevantSubUrls.push(subUrl);
                }
            }
            if (relevantSubUrls.length > 0) {
                const processPromises = relevantSubUrls.map(subUrl => processSubUrl(subUrl));
                yield Promise.all(processPromises);
            }
            else {
                yield storeMainUrlWithMessage(url, "Please see the site for more details.");
            }
        }
    });
}
// Start Process
summarizeMultipleMainUrls()
    .then(() => {
    console.log("Summarization process complete.");
    process.exit(0);
})
    .catch(error => {
    console.error("Error during summarization process:", error.message);
    process.exit(1);
});
//# sourceMappingURL=op_news.js.map