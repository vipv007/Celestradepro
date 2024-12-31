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
const API_KEY = "AIzaSyBzfYWVF3kbttQfwzzWKBhPQtZe6teGSZU"; // Replace with your actual API Key
// Function to connect to MongoDB
function connectToDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new MongoClient(MONGODB_URI);
        yield client.connect();
        return client;
    });
}
// Function to process a given URL and store data (Renamed to comSummarizeUrl)
function fxSummarizeUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { url } = req.body;
        try {
            console.log("Processing URL:", url);
            const response = yield axios.get(url);
            console.log("Fetched HTML successfully.");
            const html = response.data;
            const $ = cheerio.load(html);
            // Extract the article text
            const articleText = $("article").text();
            console.log("Extracted article text:", articleText);
            const isPremium = articleText.includes("subscribe") || articleText.includes("premium");
            if (!articleText || isPremium) {
                console.log("Content behind a paywall or unavailable.");
                return res.status(400).json({ message: "Content is behind a paywall or not available." });
            }
            // Extract the related image (looking for meta og:image or inside the article)
            let imageUrl = $("meta[property='og:image']").attr("content") || $("article img").attr("src");
            if (!imageUrl) {
                imageUrl = $("meta[name='twitter:image']").attr("content"); // fallback for Twitter cards
            }
            console.log("Related Image URL:", imageUrl);
            // Extract main points
            const mainPoints = [];
            $("article").find("h2").each((index, element) => {
                mainPoints.push($(element).text());
            });
            console.log("Main points extracted:", mainPoints);
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = yield genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });
            if (!model) {
                throw new Error("Failed to fetch the generative model.");
            }
            const parts = [
                { text: mainPoints.join(". ") },
                { text: articleText }
            ];
            const result = yield model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.9,
                    maxOutputTokens: 512,
                },
                safetySettings: [
                    {
                        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    },
                    {
                        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                    }
                ],
            });
            console.log("Generated summary successfully.");
            // Sentiment Analysis and Final Processing
            const sentiment = new Sentiment();
            const analysis = sentiment.analyze(result.response.text());
            console.log("Sentiment Analysis Result:", analysis);
            let sentimentScore = analysis.score;
            const normalizedScore = (sentimentScore + 5) / 2;
            const sentimentScoreNormalized = Math.max(1, Math.min(normalizedScore, 10));
            const sentimentLabel = sentimentScoreNormalized >= 5 ? "Positive" : "Negative";
            // Extract article date and time
            const articleDateTimeRaw = $("time").attr("datetime") || $("meta[property='article:published_time']").attr("content");
            console.log("Raw article date and time:", articleDateTimeRaw);
            let istTimeFormatted = "Unknown";
            if (articleDateTimeRaw) {
                // Try parsing the date
                let articleDate = new Date(articleDateTimeRaw);
                // Check if the date is valid
                if (isNaN(articleDate.getTime())) {
                    console.log("Invalid date format. Trying to reformat it...");
                    articleDate = new Date(Date.parse(articleDateTimeRaw.replace(/-/g, '/')));
                }
                // Convert to IST
                if (!isNaN(articleDate.getTime())) {
                    const istDate = new Date(articleDate.getTime() + 5.5 * 3600000); // Convert to IST
                    istTimeFormatted = istDate.toLocaleString('en-IN', { hour12: true });
                }
                else {
                    console.log("Failed to parse article date.");
                }
            }
            else {
                console.log("No article date found.");
            }
            const details = {
                url: url,
                headline: $("title").text(),
                mainPoints,
                articleText,
                summary: result.response.text(),
                sentimentScore: sentimentScoreNormalized.toFixed(2),
                sentiment: sentimentLabel,
                articleDateTime: istTimeFormatted,
                imageUrl // Store the related image URL
            };
            yield storeFetchedDetailsInDb(details);
            return res.status(200).json(details);
        }
        catch (error) {
            console.error("Error processing URL:", error.message);
            res.status(500).json({ message: "An error occurred." });
        }
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
module.exports = {
    fxSummarizeUrl, // Export the renamed function
};
//# sourceMappingURL=fxsummariController.js.map