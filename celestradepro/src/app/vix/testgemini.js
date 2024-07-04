// const { MongoClient } = require("mongodb");
// const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
// const axios = require("axios");
// const cheerio = require("cheerio");
// const Sentiment = require("sentiment");

// // MongoDB connection URL
// const MONGODB_URI = "mongodb://127.0.0.1/";
// const DB_NAME = "FinanceDB";

// // Configuration
// const API_KEY = "AIzaSyDfSiFTrnlnuQByZ30BQrGF-w5r4MfIPCU"; // Replace with your actual Google API Key
// const MAIN_URL = "https://www.investopedia.com/"; // Replace with your main news URL

// // Additional URLs to fetch news from
// const ADDITIONAL_URLS = [
//     "https://finance.yahoo.com/",
//     "https://www.livemint.com/",
//     "https://www.wsj.com/",
//     "https://www.bloomberg.com/technology",
//     // Add more URLs as needed
// ];

// // Function to fetch news URLs from a given URL
// async function fetchNewsUrls(mainUrl) {
//     try {
//         console.log("Fetching news URLs from:", mainUrl);
//         const response = await axios.get(mainUrl);
//         const html = response.data;

//         const $ = cheerio.load(html);

//         // Implement logic to extract relevant news URLs from the main page
//         const newsUrls = [];
//         const promises = [];
//         $("a").each((index, element) => {
//             const url = $(element).attr("href");
//             // Check if the URL is relevant and contains economic or stock-related keywords
//             if (
//                 url &&
//                 !url.startsWith("#") &&
//                 !url.startsWith("javascript") &&
//                 (
//                     url.includes("market") ||
//                     url.includes("stock") ||
//                     url.includes("equity") ||
//                     url.includes("share")
//                 )
//             ) {
//                 // Exclude URLs starting with "#" or "javascript" to avoid internal links and scripts
//                 // Check if the URL leads to a page with main points and summary
//                 promises.push(
//                     axios.get(url)
//                         .then(response => {
//                             const html = response.data;
//                             const $ = cheerio.load(html);
//                             const mainPoints = $("article").find("h2").length;
//                             const summary = $("article").text().length > 0;
//                             if (mainPoints > 0 && summary) {
//                                 // Extract headline from the title tag
//                                 const headline = $("title").text();
//                                 newsUrls.push({ url, headline });
//                             }
//                         })
//                         .catch(error => {
//                             console.error("Error fetching URL:", url, "-", error.message);
//                         })
//                 );
//             }
//         });

//         // Wait for all promises to resolve
//         await Promise.all(promises);

//         return newsUrls;
//     } catch (error) {
//         console.error("Error fetching news URLs:", error.message);
//         return [];
//     }
// }

// // Function to summarize news from a single URL
// async function summarizeNewsFromURL(newsData) {
//     const { url, headline } = newsData;
//     try {
//         console.log("Fetching news content from URL:", url);
//         const response = await axios.get(url);
//         const html = response.data;

//         const $ = cheerio.load(html);

//         // Extract all text content from the article
//         const articleText = $("article").text();

//         // Extract main points from the article
//         const mainPoints = [];
//         $("article").find("h2").each((index, element) => {
//             mainPoints.push($(element).text());
//         });

//         console.log("Main points of the news article:");
//         console.log(mainPoints);

//         // Initialize Google Generative AI client
//         const genAI = new GoogleGenerativeAI(API_KEY);

//         // Fetch generative model
//         const model = await genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });

//         if (!model) {
//             throw new Error("Failed to fetch the generative model.");
//         }

//         // Generate summarized content
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
//             { text: articleText } // Include entire article text for summarization
//         ];

//         const result = await model.generateContent({
//             contents: [{ role: "user", parts }],
//             generationConfig,
//             safetySettings,
//         });

//         // Perform sentiment analysis
//         const sentiment = new Sentiment();
//         const analysis = sentiment.analyze(result.response.text());
//         let sentimentScore = analysis.score;

//         const normalizedScore = (sentimentScore + 5) / 2;
//         const sentimentScoreNormalized = Math.max(1, Math.min(normalizedScore, 10));

//         // Determine sentiment label
//         const sentimentLabel = sentimentScoreNormalized >= 5 ? "Positive" : "Negative";

//         // Print the summary, sentiment analysis, and sentiment label
//         console.log("Summary of the main points and article text:");
//         console.log(result.response.text());
//         console.log("Sentiment analysis score:", sentimentScoreNormalized.toFixed(2), "/ 10");
//         console.log("Sentiment:", sentimentLabel);

//         // Store the fetched details in MongoDB
//         const client = new MongoClient(MONGODB_URI);
//         await client.connect();

//         const db = client.db(DB_NAME);
//         const collection = db.collection("News");

//         // Check if the news already exists in the database
//         const existingNews = await collection.findOne({ $or: [{ url: url }, { headline: headline }] });

//         if (!existingNews) {
//             // Get current date and time
//             const fetchedTime = new Date();

//             await collection.insertOne({
//                 url: url,
//                 headline: headline,
//                 mainPoints: mainPoints,
//                 articleText: articleText,
//                 summary: result.response.text(),
//                 sentimentScore: sentimentScoreNormalized.toFixed(2),
//                 sentiment: sentimentLabel,
//                 fetchedTime: fetchedTime // Add fetched time to the document
//             });

//             console.log("Fetched details stored in MongoDB.");
//         } else {
//             console.log("News already exists in the database. Skipping storage.");
//         }

//     } catch (error) {
//         console.error("Error fetching or summarizing news:", error.message);
//     }
// }

// async function summarizeMultipleNews() {
//     // Combine main URL with additional URLs
//     const allUrls = [MAIN_URL, ...ADDITIONAL_URLS];

//     const newsUrls = [];
//     for (const url of allUrls) {
//         const urls = await fetchNewsUrls(url);
//         newsUrls.push(...urls);
//     }

//     if (newsUrls.length === 0) {
//         console.log("No relevant news URLs found.");
//         return;
//     }

//     console.log("Found", newsUrls.length, "relevant news URLs.");

//     // Map each news URL to a promise that summarizes the news
//     const summarizationPromises = newsUrls.map(newsData => summarizeNewsFromURL(newsData));

//     // Execute all promises concurrently
//     await Promise.all(summarizationPromises);
// }

// summarizeMultipleNews();
const { MongoClient } = require("mongodb");
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const axios = require("axios");
const cheerio = require("cheerio");
const Sentiment = require("sentiment");

// MongoDB connection URL
const MONGODB_URI = "mongodb://127.0.0.1/";
const DB_NAME = "FinDB";

// Configuration
const API_KEY = "AIzaSyDfSiFTrnlnuQByZ30BQrGF-w5r4MfIPCU"; // Replace with your actual Google API Key
const MAIN_URL = "https://www.investopedia.com/"; // Replace with your main news URL

// Additional URLs to fetch news from
const ADDITIONAL_URLS = [
    "https://finance.yahoo.com/",
    "https://www.livemint.com/",
    "https://www.wsj.com/",
    "https://www.bloomberg.com/technology",
    // Add more URLs as needed
];

// Function to fetch news URLs from a given URL
async function fetchNewsUrls(mainUrl) {
    try {
        console.log("Fetching news URLs from:", mainUrl);
        const response = await axios.get(mainUrl);
        const html = response.data;

        const $ = cheerio.load(html);

        // Implement logic to extract relevant news URLs from the main page
        const newsUrls = [];
        const promises = [];
        $("a").each((index, element) => {
            const url = $(element).attr("href");
            // Check if the URL is relevant and contains options-related keywords
            if (
                url &&
                !url.startsWith("#") &&
                !url.startsWith("javascript") &&
                (
                    url.includes("options") ||
                    url.includes("option") ||
                    url.includes("call") ||
                    url.includes("put")
                )
            ) {
                // Exclude URLs starting with "#" or "javascript" to avoid internal links and scripts
                // Check if the URL leads to a page with main points and summary
                promises.push(
                    axios.get(url)
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
                        })
                );
            }
        });

        // Wait for all promises to resolve
        await Promise.all(promises);

        return newsUrls;
    } catch (error) {
        console.error("Error fetching news URLs:", error.message);
        return [];
    }
}

// Function to summarize news from a single URL
async function summarizeNewsFromURL(newsData) {
    const { url, headline } = newsData;
    try {
        console.log("Fetching news content from URL:", url);
        const response = await axios.get(url);
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
        const model = await genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });

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

        const result = await model.generateContent({
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
        await client.connect();

        const db = client.db(DB_NAME);
        const collection = db.collection("News");

        // Check if the news already exists in the database
        const existingNews = await collection.findOne({ $or: [{ url: url }, { headline: headline }] });

        if (!existingNews) {
            // Get current date and time
            const fetchedTime = new Date();

            await collection.insertOne({
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
        } else {
            console.log("News already exists in the database. Skipping storage.");
        }

    } catch (error) {
        console.error("Error fetching or summarizing news:", error.message);
    }
}

async function summarizeMultipleNews() {
    // Combine main URL with additional URLs
    const allUrls = [MAIN_URL, ...ADDITIONAL_URLS];

    const newsUrls = [];
    for (const url of allUrls) {
        const urls = await fetchNewsUrls(url);
        newsUrls.push(...urls);
    }

    if (newsUrls.length === 0) {
        console.log("No relevant news URLs found.");
        return;
    }

    console.log("Found", newsUrls.length, "relevant news URLs.");

    // Map each news URL to a promise that summarizes the news
    const summarizationPromises = newsUrls.map(newsData => summarizeNewsFromURL(newsData));

    // Execute all promises concurrently
    await Promise.all(summarizationPromises);
}

summarizeMultipleNews();
