require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const http = require('http');
const socketIO = require('socket.io');

// Import routes and controllers
const router = require('./router');
// Uncomment as needed
// const newsRoutes = require('./newsRoutes');
// const fnewsRoutes = require('./fnewsRoutes');
// const com_newsRoutes = require('./com_newsRoutes');
// const comProfRouter = require('./comProfRouter');
// const optionnewsRoutes = require('./optionnewsRoutes');
// const commodityController = require('./comvolController');
// const movingAverageController = require('./movavgController');
// const { fetchData, fetchAvailableDates } = require('./peggerController');
// const { comSummarizeUrl } = require('./comsummarizer');

// Initialize Express app
const app = express();
const port = process.env.PORT || 443;
const mongoUrl =
  process.env.AZURE_COSMOS_CONNECTIONSTRING ||
  'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false';
const dbName = process.env.DB_NAME || 'test';

// Log environment variables for debugging
console.log('🔗 MongoDB Connection String:', mongoUrl);
console.log('📂 Database Name:', dbName);

// Serve static files from Angular's www folder
app.use(express.static(path.join(__dirname, '../www')));

// Middleware setup
app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      'https://finance.celespro.com',
      'https://celescontainerwebapp-staging-b5g9ehgkhyb0dpe9.westus3-01.azurewebsites.net',
      'https://celescontainerwebapp.azurewebsites.net',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// Fallback to Angular's index.html for unknown routes
app.get('*', (req, res) => {
  console.log('🌐 Serving Angular frontend for route:', req.url);
  res.sendFile(path.join(__dirname, '../www/index.html'));
});

// MongoDB connection
console.log('🛠️ Connecting to MongoDB...');
mongoose
  .connect(mongoUrl, {
    dbName: dbName,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected successfully to:', dbName))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// WebSocket setup
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('🔌 New client connected');

  const collection = mongoose.connection.collection('Live_Datas');
  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newPrice = change.fullDocument;
      console.log('📈 New price update:', newPrice);
      socket.emit('priceUpdate', newPrice);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

// API Routes
app.use('/api', router);
// Uncomment as needed:
// app.use('/api/news', newsRoutes);
// app.use('/api/fnews', fnewsRoutes);
// app.use('/api/com_news', com_newsRoutes);
// app.use('/com-prof', comProfRouter);
// app.use('/api/optionnews', optionnewsRoutes);

// Data fetching routes
// app.get('/api/data', fetchData);
// app.get('/api/data/dates', fetchAvailableDates);
// app.post('/comnews/com-summarize-url', comSummarizeUrl);

// Commodity-related routes
// app.get('/api/commodities', commodityController.getAllCommodities);
// app.get('/api/moving-averages/:commodity', movingAverageController.getMovingAverages);

// Custom logic for main functionality
require('./main')(app, MongoClient, mongoUrl, dbName);

// Server start
server.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
  console.log('🌐 Frontend at `/` and backend API at `/api`');
});

// Database connection logic (optional for native MongoDB usage)
async function connectToDatabase() {
  try {
    const client = new MongoClient(mongoUrl);
    await client.connect();
    console.log('✅ Connected to Azure Cosmos DB!');
    return client.db(dbName);
  } catch (error) {
    console.error('❌ Failed to connect to Azure Cosmos DB:', error);
    throw error;
  }
}

module.exports = connectToDatabase;
