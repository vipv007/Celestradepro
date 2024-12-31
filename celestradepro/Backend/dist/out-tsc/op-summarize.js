var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Required Modules
const { MongoClient } = require("mongodb");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const axios = require("axios");
const cheerio = require("cheerio");
const Sentiment = require("sentiment");
// Configuration Constants
const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = "FinanceDB";
const API_KEY = "AIzaSyBzfYWVF3kbttQfwzzWKBhPQtZe6teGSZU"; // Replace with your Google API Key
// MongoDB connection
function opConnectToDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new MongoClient(MONGODB_URI);
            yield client.connect();
            console.log("Connected to MongoDB.");
            return client;
        }
        catch (err) {
            console.error("MongoDB Connection Error:", err.message);
            throw new Error("Failed to connect to the database.");
        }
    });
}
// Store details in MongoDB
function opStoreFetchedDetailsInDb(details) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield opConnectToDb();
            const db = client.db(DB_NAME);
            const collection = db.collection("op_news");
            // Check if the news already exists
            const existingNews = yield collection.findOne({ url: details.url });
            if (!existingNews) {
                yield collection.insertOne(details);
                console.log("News stored successfully in MongoDB.");
            }
            else {
                console.log("News already exists in the database.");
            }
            yield client.close();
        }
        catch (err) {
            console.error("Error storing details in the database:", err.message);
        }
    });
}
// Flexible function to extract text from any web page
function opExtractArticleText($) {
    let articleText = "";
    // Try different methods to find relevant text
    const selectors = [
        'article',
        'div[class*="content"]',
        'div[id*="content"]',
        'p',
        'div[class*="article"]',
        'section',
    ];
    for (let selector of selectors) {
        const extractedText = $(selector).text().trim();
        if (extractedText.length > 200) {
            articleText = extractedText;
            break;
        }
    }
    return articleText;
}
// Function to extract and format article date/time
function opExtractArticleDateTime($) {
    let articleDateTimeFormatted = "Unknown";
    // Possible selectors for date extraction
    const possibleDateSelectors = [
        "time[datetime]",
        "meta[property='article:published_time']",
        "meta[name='pubdate']",
        "meta[name='date']",
        "meta[itemprop='datePublished']",
        "div[class*='date']",
        "span[class*='date']",
    ];
    let articleDateTimeRaw = null;
    for (let selector of possibleDateSelectors) {
        articleDateTimeRaw = $(selector).attr("content") || $(selector).text().trim();
        if (articleDateTimeRaw) {
            break;
        }
    }
    console.log("Raw date/time values found:", { articleDateTimeRaw });
    if (articleDateTimeRaw) {
        const articleDate = new Date(articleDateTimeRaw);
        if (!isNaN(articleDate.getTime())) {
            const istDate = new Date(articleDate.getTime() + 5.5 * 3600000); // Convert to IST
            articleDateTimeFormatted = istDate.toLocaleString("en-IN", { hour12: true });
        }
        else {
            console.log("Invalid date format found:", articleDateTimeRaw);
        }
    }
    else {
        console.log("No date/time information found.");
    }
    return articleDateTimeFormatted;
}
// Main function to fetch and summarize news from a URL
function opSummarizeUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { url } = req.body;
        try {
            console.log("Processing URL:", url);
            // Fetch the webpage HTML
            const response = yield axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            console.log("Fetched HTML successfully.");
            // Extract article text using a more flexible approach
            const articleText = opExtractArticleText($);
            if (!articleText) {
                console.log("No article content found.");
                return res.status(400).json({ message: "No article content found." });
            }
            // Detect if the article is behind a paywall
            if (articleText.includes("subscribe") || articleText.includes("premium")) {
                console.log("Content is behind a paywall.");
                return res.status(400).json({ message: "Content is behind a paywall." });
            }
            // Extract article main points (usually <h2> elements)
            const mainPoints = [];
            $('h2').each((i, el) => mainPoints.push($(el).text().trim()));
            console.log("Main points extracted:", mainPoints);
            // Extract related image URL
            let imageUrl = $("meta[property='og:image']").attr("content") || $("img").attr("src");
            imageUrl = imageUrl || $("meta[name='twitter:image']").attr("content");
            console.log("Related image URL:", imageUrl);
            // Extract and format article date/time
            const articleDateTimeFormatted = opExtractArticleDateTime($);
            console.log("Formatted article date/time:", articleDateTimeFormatted);
            // Initialize Google Generative AI for summarization
            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = yield genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });
            if (!model)
                throw new Error("Generative model not found.");
            // Prepare content for generation
            const result = yield model.generateContent({
                contents: [{ role: "user", parts: [{ text: mainPoints.join(". ") }, { text: articleText }] }],
                generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 512 },
                safetySettings: [
                    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }
                ]
            });
            // Sentiment analysis
            const sentiment = new Sentiment();
            const analysis = sentiment.analyze(result.response.text());
            const sentimentScore = Math.max(1, Math.min(((analysis.score + 5) / 2), 10));
            const sentimentLabel = sentimentScore >= 5 ? "Positive" : "Negative";
            console.log("Sentiment analysis result:", sentimentLabel, sentimentScore);
            // Prepare details object
            const details = {
                url,
                headline: $("title").text(),
                mainPoints,
                articleText,
                summary: result.response.text(),
                sentimentScore: sentimentScore.toFixed(2),
                sentiment: sentimentLabel,
                articleDateTime: articleDateTimeFormatted,
                imageUrl
            };
            // Store the news in the database
            yield opStoreFetchedDetailsInDb(details);
            return res.status(200).json(details);
        }
        catch (error) {
            console.error("Error processing URL:", error.message);
            return res.status(500).json({ message: "An error occurred while processing the URL." });
        }
    });
}
// Export the function for external use
module.exports = {
    opSummarizeUrl,
};
//# sourceMappingURL=op-summarize.js.map