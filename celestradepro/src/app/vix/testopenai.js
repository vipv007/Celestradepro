// const axios = require('axios');

// // Replace 'YOUR_API_KEY' with your actual API key
// const subscriptionKey = '641023208049471a8d63ec2574aa0f90';
// const endpoint = 'https://celesoai.openai.azure.com/';


// // Story parts
// const storyParts = [
//     "Once upon a time, in a faraway kingdom...",
//     "The kingdom was ruled by a wise and just king.",
//     "But one day, darkness descended upon the land...",
//     "The people cried out for a hero to save them.",
//     "And so, a brave knight stepped forward to face the evil...",
//     "With courage and determination, the knight embarked on a perilous journey...",
//     "After many trials and tribulations, the knight emerged victorious...",
//     "The kingdom rejoiced, and peace was restored once more.",
// ];

// // Function to analyze sentiment of story parts
// async function analyzeSentiment() {
//     const documents = {
//         documents: storyParts.map((part, index) => ({ id: index.toString(), text: part }))
//     };

//     const headers = {
//         'Content-Type': 'application/json',
//         'Ocp-Apim-Subscription-Key': subscriptionKey
//     };

//     try {
//         const response = await axios.post(endpoint, documents, { headers });
//         const sentiments = response.data.documents;
//         sentiments.forEach((sentiment, index) => {
//             const tone = sentiment.sentiment === 'positive' ? 'uplifting' :
//                 sentiment.sentiment === 'neutral' ? 'neutral' : 'dramatic';
//             console.log(`Part ${index + 1}: ${storyParts[index]} [${tone}]`);
//         });
//     } catch (error) {
//         console.error('Error:', error.response.data.error.message);
//     }
// }

// // Call the function to analyze sentiment of story parts
// analyzeSentiment();

const axios = require("axios");
const cheerio = require("cheerio");

async function getLinksFromWSJHomepage() {
    try {
        const url = "https://www.wsj.com/";
        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);

        const allLinks = [];

        // Find all anchor tags (links)
        $("a").each((index, element) => {
            const href = $(element).attr("href");
            if (href && href.trim() !== "" && !href.startsWith("#")) {
                allLinks.push(href);
            }
        });

        console.log("All links found on the Wall Street Journal homepage:");
        console.log(allLinks);
    } catch (error) {
        console.error("Error fetching links:", error.message);
    }
}

getLinksFromWSJHomepage();
