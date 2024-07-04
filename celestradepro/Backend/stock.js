const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const axios = require("axios");
const Sentiment = require("sentiment");

// Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = "tiLWsvIBV2jw1NayRrZ9NO0hI4LU8_vu";

// Google Generative AI API key
const GENERATIVE_AI_API_KEY = "AIzaSyDfSiFTrnlnuQByZ30BQrGF-w5r4MfIPCU";

// Function to fetch stock news for a symbol
async function fetchStockNews(symbol) {
    try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${ALPHA_VANTAGE_API_KEY}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stock news:", error.message);
        return null;
    }
}

// Function to analyze sentiment using Gemini AI
async function analyzeSentimentWithGeminiAI(text) {
    try {
        // Initialize Google Generative AI client
        const genAI = new GoogleGenerativeAI(GENERATIVE_AI_API_KEY);

        // Fetch generative model
        const model = await genAI.getGenerativeModel({ model: "models/gemini-1.0-pro" });
        if (!model) {
            throw new Error("Failed to fetch the generative model.");
        }

        // Generate content for sentiment analysis
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

        const parts = [{ text }];

        const result = await model.generateContent({
            contents: [{ role: "user", parts }],
            generationConfig,
            safetySettings,
        });

        // Perform sentiment analysis using the Sentiment library
        const sentiment = new Sentiment();
        const analysis = sentiment.analyze(result.response.text());
        const sentimentScore = analysis.score;
        const sentimentLabel = sentimentScore > 0 ? "positive" : sentimentScore < 0 ? "negative" : "neutral";

        // Print the sentiment analysis result
        console.log("Sentiment analysis score:", sentimentScore);
        console.log("Sentiment analysis:", sentimentLabel);

        return { score: sentimentScore, label: sentimentLabel };
    } catch (error) {
        console.error("Error analyzing sentiment:", error.message);
        return null;
    }
}

// Example usage
const symbol = "AAPL"; // Apple Inc. symbol
fetchStockNews(symbol)
    .then(newsData => {
        if (newsData) {
            // Process the stock news data here
            console.log(newsData);

            // Analyze sentiment using Gemini AI
            const newsText = "Extracted news content"; // Replace with actual news content
            analyzeSentimentWithGeminiAI(newsText)
                .then(sentimentResult => {
                    if (sentimentResult !== null) {
                        // Use the sentiment analysis result for further processing
                        console.log("Sentiment analysis result:", sentimentResult);
                    }
                });
        }
    });
