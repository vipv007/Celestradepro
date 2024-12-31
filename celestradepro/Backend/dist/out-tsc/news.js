// // const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
// // const axios = require("axios");
// // const cheerio = require("cheerio");
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// // // Configuration
// // const API_KEY = "AIzaSyDfSiFTrnlnuQByZ30BQrGF-w5r4MfIPCU"; // Replace with your Gemini API key
// // const NEWS_URL = "https://www.livemint.com/market/stock-market-news/why-is-india-stock-market-down-today-explained-with-5-reasons-11713153938923.html"; // Replace with the news URL you want to summarize
// // // Function to fetch and summarize news from URL
// // async function summarizeNewsFromURL() {
// //     try {
// //         console.log("Fetching news content from URL...");
// //         // Fetch HTML content from URL
// //         const response = await axios.get(NEWS_URL);
// //         const html = response.data;
// //         // Load HTML into Cheerio for parsing
// //         const $ = cheerio.load(html);
// //         // Extract main points of the news article
// //         const mainPoints = [];
// //         $("article").find("h2").each((index, element) => {
// //             mainPoints.push($(element).text());
// //         });
// //         console.log("Main points of the news article:");
// //         console.log(mainPoints);
// //         console.log("Initializing Google Generative AI client...");
// //         // Initialize Google Generative AI client
// //         const genAI = new GoogleGenerativeAI(API_KEY);
// //         console.log("Fetching generative model...");
// //         // Get the generative model (using Gemini 1.0 Pro)
// //         const model = await genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });
// //         if (!model) {
// //             throw new Error("Failed to fetch the generative model.");
// //         }
// //         console.log("Generating summarized content...");
// //         // Configuration for text generation
// //         const generationConfig = {
// //             temperature: 0.7,
// //             topP: 0.9,
// //             maxOutputTokens: 512,
// //         };
// //         // Safety settings to filter harmful content
// //         const safetySettings = [
// //             {
// //                 category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
// //                 threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
// //             },
// //             {
// //                 category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
// //                 threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
// //             },
// //         ];
// //         // Parts of the content to be summarized
// //         const parts = [
// //             { text: mainPoints.join(". ") }, // Combine main points into a single string
// //         ];
// //         // Generate summarized content
// //         const result = await model.generateContent({
// //             contents: [{ role: "user", parts }],
// //             generationConfig,
// //             safetySettings,
// //         });
// //         // Print the summary
// //         console.log("Summary of the main points:");
// //         console.log(result.response.text());
// //     } catch (error) {
// //         console.error("Error fetching or summarizing news:", error.message);
// //     }
// // }
// const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const Sentiment = require("sentiment");
// // Configuration
// const API_KEY = "AIzaSyDfSiFTrnlnuQByZ30BQrGF-w5r4MfIPCU";
// const NEWS_URL = "https://www.livemint.com/market/stock-market-news/why-is-india-stock-market-down-today-explained-with-5-reasons-11713153938923.html";
// // Function to fetch and summarize news from URL
// async function summarizeNewsFromURL() {
//     try {
//         console.log("Fetching news content from URL...");
//         const response = await axios.get(NEWS_URL);
//         const html = response.data;
//         const $ = cheerio.load(html);
//         const mainPoints = [];
//         $("article").find("h2").each((index, element) => {
//             mainPoints.push($(element).text());
//         });
//         console.log("Main points of the news article:");
//         console.log(mainPoints);
//         console.log("Initializing Google Generative AI client...");
//         const genAI = new GoogleGenerativeAI(API_KEY);
//         console.log("Fetching generative model...");
//         const model = await genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });
//         if (!model) {
//             throw new Error("Failed to fetch the generative model.");
//         }
//         console.log("Generating summarized content...");
//         const generationConfig = {
//             temperature: 0.7,
//             topP: 0.9,
//             maxOutputTokens: 512,
//         };
//         const safetySettings = [
//             {
//                 category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
//                 threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//             },
//             {
//                 category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
//                 threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
//             },
//         ];
//         const parts = [
//             { text: mainPoints.join(". ") },
//         ];
//         const result = await model.generateContent({
//             contents: [{ role: "user", parts }],
//             generationConfig,
//             safetySettings,
//         });
//         // Perform sentiment analysis
//         const sentiment = new Sentiment();
//         const analysis = sentiment.analyze(result.response.text());
//         const sentimentScore = analysis.score;
//         const sentimentScoreNormalized = (sentimentScore + 5) * 2; // Normalize score to a scale of 0 to 10
//         // Determine if the news is positive, negative, or neutral
//         let sentimentLabel;
//         if (sentimentScore > 0) {
//             sentimentLabel = "positive";
//         } else if (sentimentScore < 0) {
//             sentimentLabel = "negative";
//         } else {
//             sentimentLabel = "neutral";
//         }
//         // Print the summary, sentiment analysis, and sentiment label
//         console.log("Summary of the main points:");
//         console.log(result.response.text());
//         console.log("Sentiment analysis score:", sentimentScoreNormalized.toFixed(2), "/ 10");
//         console.log("Sentiment analysis:", sentimentLabel);
//     } catch (error) {
//         console.error("Error fetching or summarizing news:", error.message);
//     }
// }
// summarizeNewsFromURL();
const { MongoClient } = require("mongodb");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const axios = require("axios");
const cheerio = require("cheerio");
const Sentiment = require("sentiment");
// MongoDB connection URL
const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = "Finance";
// Configuration
const API_KEY = "AIzaSyDfSiFTrnlnuQByZ30BQrGF-w5r4MfIPCU"; // Replace with your actual Google API Key
const MAIN_URL = "https://www.investopedia.com/"; // Replace with your main news URL
// Function to fetch news URLs from the main link for stocks and commodities
function fetchNewsUrls(mainUrl, keywords) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Fetching news URLs from:", mainUrl);
            const response = yield axios.get(mainUrl);
            const html = response.data;
            const $ = cheerio.load(html);
            // Implement logic to extract relevant news URLs from the main page
            const newsUrls = [];
            const promises = [];
            $("a").each((index, element) => {
                const url = $(element).attr("href");
                // Check if the URL is relevant and contains keywords
                if (url &&
                    !url.startsWith("#") &&
                    !url.startsWith("javascript") &&
                    keywords.some(keyword => url.includes(keyword))) {
                    // Exclude URLs starting with "#" or "javascript" to avoid internal links and scripts
                    // Check if the URL leads to a page with main points and summary
                    promises.push(axios.get(url)
                        .then(response => {
                        const html = response.data;
                        const $ = cheerio.load(html);
                        const mainPoints = $("article").find("h2").length;
                        const summary = $("article").text().length > 0;
                        if (mainPoints > 0 && summary) {
                            // Extract headline from the title tag
                            const headline = $("title").text();
                            newsUrls.push({ url, headline });
                        }
                    })
                        .catch(error => {
                        console.error("Error fetching URL:", url, "-", error.message);
                    }));
                }
            });
            // Wait for all promises to resolve
            yield Promise.all(promises);
            return newsUrls;
        }
        catch (error) {
            console.error("Error fetching news URLs:", error.message);
            return [];
        }
    });
}
// Function to summarize news from a single URL
function summarizeNewsFromURL(newsData) {
    return __awaiter(this, void 0, void 0, function* () {
        const { url, headline } = newsData;
        try {
            console.log("Fetching news content from URL:", url);
            const response = yield axios.get(url);
            const html = response.data;
            const $ = cheerio.load(html);
            // Extract all text content from the article
            const articleText = $("article").text();
            // Extract main points from the article
            const mainPoints = [];
            $("article").find("h2").each((index, element) => {
                mainPoints.push($(element).text());
            });
            console.log("Main points of the news article:");
            console.log(mainPoints);
            // Initialize Google Generative AI client
            const genAI = new GoogleGenerativeAI(API_KEY);
            // Fetch generative model
            const model = yield genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });
            if (!model) {
                throw new Error("Failed to fetch the generative model.");
            }
            // Generate summarized content
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
                { text: articleText } // Include entire article text for summarization
            ];
            const result = yield model.generateContent({
                contents: [{ role: "user", parts }],
                generationConfig,
                safetySettings,
            });
            // Perform sentiment analysis
            const sentiment = new Sentiment();
            const analysis = sentiment.analyze(result.response.text());
            let sentimentScore = analysis.score;
            const normalizedScore = (sentimentScore + 5) / 2;
            const sentimentScoreNormalized = Math.max(1, Math.min(normalizedScore, 10));
            // Determine sentiment label
            const sentimentLabel = sentimentScoreNormalized >= 5 ? "Positive" : "Negative";
            // Print the summary, sentiment analysis, and sentiment label
            console.log("Summary of the main points and article text:");
            console.log(result.response.text());
            console.log("Sentiment analysis score:", sentimentScoreNormalized.toFixed(2), "/ 10");
            console.log("Sentiment:", sentimentLabel);
            // Store the fetched details in MongoDB
            const client = new MongoClient(MONGODB_URI);
            yield client.connect();
            const db = client.db(DB_NAME);
            const collection = db.collection("News");
            // Get current date and time
            const fetchedTime = new Date();
            yield collection.insertOne({
                url: url,
                headline: headline,
                mainPoints: mainPoints,
                articleText: articleText,
                summary: result.response.text(),
                sentimentScore: sentimentScoreNormalized.toFixed(2),
                sentiment: sentimentLabel,
                fetchedTime: fetchedTime // Add fetched time to the document
            });
            console.log("Fetched details stored in MongoDB.");
        }
        catch (error) {
            console.error("Error fetching or summarizing news:", error.message);
        }
    });
}
function summarizeMultipleNews(keywords) {
    return __awaiter(this, void 0, void 0, function* () {
        const newsUrls = yield fetchNewsUrls(MAIN_URL, keywords);
        if (newsUrls.length === 0) {
            console.log("No relevant news URLs found.");
            return;
        }
        console.log("Found", newsUrls.length, "relevant news URLs.");
        for (const newsData of newsUrls) {
            yield summarizeNewsFromURL(newsData);
        }
    });
}
// Keywords for stock-related news
const stockKeywords = ["market", "stock", "equity", "share"];
// Keywords for commodity-related news
const commodityKeywords = ["commodity", "gold", "silver", "oil", "copper"];
// Call the function to summarize multiple stock news articles
summarizeMultipleNews(stockKeywords);
// Call the function to summarize multiple commodity news articles
summarizeMultipleNews(commodityKeywords);
//# sourceMappingURL=news.js.map