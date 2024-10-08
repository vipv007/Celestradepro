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
    "https://finance.yahoo.com/",
    "https://www.livemint.com/",
    "https://www.wsj.com/",
    "https://www.bloomberg.com/technology",
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
            if (subUrl && !subUrl.startsWith("#") && !subUrl.startsWith("javascript") && (subUrl.includes("stock") || subUrl.includes("finance") || subUrl.includes("market"))) {
                const fullUrl = new URL(subUrl, url).href; // Ensure it's a full URL
                subUrls.push(fullUrl);
            }
        });

        console.log("Found", subUrls.length, "sub-URLs from", url);
        return subUrls;
    } catch (error) {
        console.error("Error fetching sub-URLs from", url, ":", error.message);
        await storeMainUrlErrorInDb(url, "Please see the site for more details.");
        return [];
    }
}

// Function to process sub-URLs and store data
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

        // Fetch the main image URL
        const imageUrl = fetchNewsImage($);
        console.log("News image URL:", imageUrl);

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

        // Extract article date and time
        const articleDateTime = $("time").attr("datetime") || $("meta[property='article:published_time']").attr("content");

        if (!articleDateTime) {
            console.log("No article date and time found.");
            return; // Skip storing if no date and time found
        }

        // Convert to IST (Indian Standard Time)
        const articleDate = new Date(articleDateTime);
        const istOffset = 5 * 60 + 30; // IST is UTC+5:30
        const istDate = new Date(articleDate.getTime() + istOffset * 60000); // Convert to IST

        // Format the IST date and time with AM/PM
        const options = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true, timeZone: 'Asia/Kolkata' };
        const istTimeFormatted = istDate.toLocaleDateString('en-IN', options);

        console.log("Article Date and Time (IST):", istTimeFormatted);

        // Store only if meaningful content is available
        await storeFetchedDetailsInDb({
            url: subUrl,
            headline: $("title").text(),
            mainPoints: mainPoints,
            articleText: articleText,
            summary: result.response.text(),
            sentimentScore: sentimentScoreNormalized.toFixed(2),
            sentiment: sentimentLabel,
            articleDateTime: istTimeFormatted,
            imageUrl: imageUrl, // Store the news image URL
        });

    } catch (error) {
        console.error("Error processing sub-URL:", error.message);
        // Do not store error messages for sub-URLs
    }
}

// Function to fetch the news image URL
function fetchNewsImage($) {
    // Attempt to find the image using common tags and meta properties
    const ogImage = $("meta[property='og:image']").attr("content");
    const twitterImage = $("meta[name='twitter:image']").attr("content");
    const imgTagImage = $("img").first().attr("src");

    // Use og:image first, then twitter:image, then fallback to the first <img> tag
    return ogImage || twitterImage || imgTagImage || "No image found";
}

// Function to store an error message for a main URL in the database
async function storeMainUrlErrorInDb(url, message) {
    const client = await connectToDb();
    const db = client.db(DB_NAME);
    const collection = db.collection("st_news");

    const existingNews = await collection.findOne({ url: url });

    if (!existingNews) {
        await collection.insertOne({
            url: url,
            headline: url,
            mainPoints: ["N/A"],
            articleText: "N/A",
            summary: message,
            sentimentScore: "N/A",
            sentiment: "N/A",
            articleDateTime: "N/A",
            imageUrl: "N/A"
        });

        console.log("Stored main URL error message in MongoDB.");
    } else {
        console.log("Main URL error already exists in the database. Skipping storage.");
    }

    await client.close();
}

// Function to store fetched details in the database
async function storeFetchedDetailsInDb(details) {
    const client = await connectToDb();
    const db = client.db(DB_NAME);
    const collection = db.collection("st_news");

    const existingNews = await collection.findOne({ url: details.url });

    if (!existingNews) {
        await collection.insertOne(details);

        console.log("Fetched details stored in MongoDB.");
    } else {
        console.log("News already exists in the database. Skipping storage.");
    }

    await client.close();
}

// Function to summarize multiple main URLs
async function summarizeMultipleMainUrls() {
    for (const url of MAIN_URLS) {
        const subUrls = await fetchSubUrlsFromMainUrl(url);
        const processPromises = subUrls.map(subUrl => processSubUrl(subUrl));
        await Promise.all(processPromises);
    }
}

summarizeMultipleMainUrls();
