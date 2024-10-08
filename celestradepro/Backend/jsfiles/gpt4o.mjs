import fs from 'fs/promises';
import path from 'path';
import { Configuration, OpenAIApi } from 'openai';

// Set your OpenAI API key here
const OPENAI_API_KEY = 'sk-proj-qlQ9XV0eAN7U93xOdXZET3BlbkFJW4BFplIDU5oHFJV1IckF';

// Initialize OpenAI API client
const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Main function to process image and get details from OpenAI
async function main() {
  // Path to your local image
  const imagePath = path.join(__dirname, 'C:\Users\vipve\Downloads\nnn.jpg');

  try {
    // Read the image as base64
    const imageBase64 = await fs.readFile(imagePath, { encoding: 'base64' });

    // Call OpenAI API to analyze the image
    const response = await openai.images.analyze({
      image: {
        content: imageBase64,
      },
    });

    // Log the details received from OpenAI
    console.log('Image Analysis:');
    console.log(response.data);
  } catch (error) {
    console.error('Error reading or analyzing the image:', error);
  }
}

// Run the main function
main();
