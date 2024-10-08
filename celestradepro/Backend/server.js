require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// Import routes and controllers
const router = require('./router');
const newsRoutes = require('./newsRoutes');
const fnewsRoutes = require('./fnewsRoutes');
const com_newsRoutes = require('./com_newsRoutes');
const comProfRouter = require('./comProfRouter');
const { fetchData, fetchAvailableDates } = require('./peggerController');
const optionnewsRoutes = require('./optionnewsRoutes');
const commodityController = require('./comvolController');
const movingAverageController = require('./movavgController');
const newsRouter = require("./newsRouter");
const { comSummarizeUrl } = require('./comsummarizer');

// Initialize Express app
const app = express();

// MongoDB URL from environment variables (set in Docker Compose)
//const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';  // Default MongoDB URL for local development
const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27018';  // Change 'FinanceDB' to your actual database name

const dbName = process.env.DB_NAME || 'FinanceDB';
const port = process.env.PORT || 3003;  // Default server port

// MongoDB connection using Mongoose
mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connected successfully');
})
.catch((error) => {
  console.log('Database connection error:', error);
});

// Middleware setup
app.use(bodyParser.json());  // Parse incoming JSON requests
app.use(cors());  // Enable Cross-Origin Resource Sharing (CORS)

// API Routes
app.post('/comnews/com-summarize-url', comSummarizeUrl);  // Commodity news summarizer route
app.use('/api', router);  // General API routes
app.use('/api/news', newsRoutes);  // News routes
app.use('/api/fnews', fnewsRoutes);  // Financial news routes
app.use('/api/com_news', com_newsRoutes);  // Commodity news routes
app.use('/com-prof', comProfRouter);  // Company profiles
app.use('/api/optionnews', optionnewsRoutes);  // Options news routes
app.use("/api/news", newsRouter);  // Additional news routes

// Data fetching routes
app.get('/api/data', fetchData);  // Fetch general data
app.get('/api/data/dates', fetchAvailableDates);  // Fetch available dates for data

// Commodity-related routes
app.get('/api/commodities', commodityController.getAllCommodities);  // Fetch all commodities
app.get('/api/moving-averages/:commodity', movingAverageController.getMovingAverages);  // Fetch moving averages for a commodity

// Start the server
app.listen(port, () => console.log(`Server is listening on port ${port}`));

// Custom logic for main functionality
require('./main')(app, MongoClient, mongoUrl, dbName);  // Pass app, MongoClient, and DB settings to main logic
