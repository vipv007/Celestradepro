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
async function connectToDb() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    return client;
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

// Check Content Relevance
async function isRelevantContent(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const articleText = $("article").text().toLowerCase();
        return optionsTradingKeywords.some(keyword => articleText.includes(keyword));
    } catch (error) {
        console.error("Error checking relevance for URL:", url, "-", error.message);
        return false;
    }
}

// Fetch Image URL from Article
function fetchImageUrl($) {
    const ogImage = $("meta[property='og:image']").attr("content");
    const twitterImage = $("meta[name='twitter:image']").attr("content");
    const imgTag = $("article img").first().attr("src");

    return ogImage || twitterImage || imgTag || "";
}

// Process Each Sub-URL
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
        const sentimentScore = analysis.score;

        const normalizedScore = (sentimentScore + 5) / 2;
        const sentimentScoreNormalized = Math.max(1, Math.min(normalizedScore, 10));
        const sentimentLabel = sentimentScoreNormalized >= 5 ? "Positive" : "Negative";

        await storeFetchedDetailsInDb({
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

    } catch (error) {
        console.error("Error processing sub-URL:", error.message);
    }
}

// Store Details in MongoDB
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

// Store Message for Main URL
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
                articleDateTime: convertToIST(new Date()),
                imageUrl: ""
            }
        },
        { upsert: true }
    );

    console.log("Stored main URL with message in MongoDB.");
    await client.close();
}

// Summarize and Process Multiple URLs
async function summarizeMultipleMainUrls() {
    for (const url of MAIN_URLS) {
        const subUrls = await fetchSubUrlsFromMainUrl(url);

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
