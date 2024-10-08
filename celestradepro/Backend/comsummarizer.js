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
async function connectToDb() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log("Connected to MongoDB.");
        return client;
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        throw new Error("Failed to connect to the database.");
    }
}

// Store details in MongoDB
async function storeFetchedDetailsInDb(details) {
    try {
        const client = await connectToDb();
        const db = client.db(DB_NAME);
        const collection = db.collection("com_news");

        // Check if the news already exists
        const existingNews = await collection.findOne({ url: details.url });
        if (!existingNews) {
            await collection.insertOne(details);
            console.log("News stored successfully in MongoDB.");
        } else {
            console.log("News already exists in the database.");
        }

        await client.close();
    } catch (err) {
        console.error("Error storing details in the database:", err.message);
    }
}

// Flexible function to extract text from any web page
function extractArticleText($) {
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
            return extractedText;
        }
    }

    return ""; // Return empty if no valid text found
}

// Function to extract and format article date/time
function extractArticleDateTime($) {
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

    // Debugging output for what was found
    console.log("Raw date/time values found:", { articleDateTimeRaw });

    if (articleDateTimeRaw) {
        const articleDate = new Date(articleDateTimeRaw);
        if (!isNaN(articleDate.getTime())) {
            const istDate = new Date(articleDate.getTime() + 5.5 * 3600000); // Convert to IST
            return istDate.toLocaleString("en-IN", { hour12: true });
        } else {
            console.log("Invalid date format found:", articleDateTimeRaw);
        }
    } else {
        console.log("No date/time information found.");
    }

    return "Unknown"; // Default return if no date is found
}

// Initialize Google Generative AI
async function initializeGenerativeAI() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = await genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });

    if (!model) throw new Error("Generative model not found.");
    return model;
}

// Sentiment analysis
function analyzeSentiment(text) {
    const sentiment = new Sentiment();
    const analysis = sentiment.analyze(text);
    const sentimentScore = Math.max(1, Math.min(((analysis.score + 5) / 2), 10));
    const sentimentLabel = sentimentScore >= 5 ? "Positive" : "Negative";
    return { sentimentScore: sentimentScore.toFixed(2), sentimentLabel };
}

// Main function to fetch and summarize news from a URL
async function comSummarizeUrl(req, res) {
    const { url } = req.body;

    try {
        console.log("Processing URL:", url);

        // Fetch the webpage HTML
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        console.log("Fetched HTML successfully.");

        // Extract article text
        const articleText = extractArticleText($);
        if (!articleText) {
            console.log("No article content found.");
            return res.status(400).json({ message: "No article content found." });
        }

        // Detect if the article is behind a paywall
        if (articleText.includes("subscribe") || articleText.includes("premium")) {
            console.log("Content is behind a paywall.");
            return res.status(400).json({ message: "Content is behind a paywall." });
        }

        // Extract main points
        const mainPoints = [];
        $('h2').each((i, el) => mainPoints.push($(el).text().trim()));
        console.log("Main points extracted:", mainPoints);

        // Extract related image URL
        let imageUrl = $("meta[property='og:image']").attr("content") || $("img").attr("src");
        imageUrl = imageUrl || $("meta[name='twitter:image']").attr("content"); 
        console.log("Related image URL:", imageUrl);

        // Extract and format article date/time
        const articleDateTimeFormatted = extractArticleDateTime($);
        console.log("Formatted article date/time:", articleDateTimeFormatted);

        // Initialize the generative model
        const model = await initializeGenerativeAI();

        // Prepare content for generation
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: mainPoints.join(". ") }, { text: articleText }] }],
            generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 512 },
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE }
            ]
        });

        // Sentiment analysis
        const { sentimentScore, sentimentLabel } = analyzeSentiment(result.response.text());
        console.log("Sentiment analysis result:", sentimentLabel, sentimentScore);

        // Prepare details object
        const details = {
            url,
            headline: $("title").text(),
            mainPoints,
            articleText,
            summary: result.response.text(),
            sentimentScore,
            sentiment: sentimentLabel,
            articleDateTime: articleDateTimeFormatted,
            imageUrl
        };

        // Store the news in the database
        await storeFetchedDetailsInDb(details);
        return res.status(200).json(details);
    } catch (error) {
        console.error("Error processing URL:", error.message);
        return res.status(500).json({ message: "An error occurred while processing the URL." });
    }
}

// Export the function for external use
module.exports = {
    comSummarizeUrl,
};
