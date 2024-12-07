require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const http = require('http');
const socketIO = require('socket.io');

// Import routes and controllers
const router = require('./router');
const newsRoutes = require('./newsRoutes');
const fnewsRoutes = require('./fnewsRoutes');
const com_newsRoutes = require('./com_newsRoutes');
const comProfRouter = require('./comProfRouter');
const optionnewsRoutes = require('./optionnewsRoutes');
const commodityController = require('./comvolController');
const movingAverageController = require('./movavgController');
const { fetchData, fetchAvailableDates } = require('./peggerController');
const { comSummarizeUrl } = require('./comsummarizer');

// Initialize Express app
const app = express();

const port = process.env.PORT || 3000;
 const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
 const dbName = process.env.DB_NAME || 'FinanceDB';

//const mongoUrl = process.env.AZURE_COSMOS_CONNECTIONSTRING ||'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';

//const dbName =  process.env.DB_NAME ||'celescontainerwebapp-db';

console.log('MongoDB Connection String:', process.env.AZURE_COSMOS_CONNECTIONSTRING);
console.log('Database Name:', process.env.DB_NAME);


const server = http.createServer(app);
const io = socketIO(server);

mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(`Connected to MongoDB at ${mongoUrl}/${dbName}`))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// API Routes
app.use('/api', router);
app.use('/api/news', newsRoutes);
app.use('/api/fnews', fnewsRoutes);
app.use('/api/com_news', com_newsRoutes);
app.use('/com-prof', comProfRouter);
app.use('/api/optionnews', optionnewsRoutes);

// Data fetching routes
app.get('/api/data', fetchData);
app.get('/api/data/dates', fetchAvailableDates);
app.post('/comnews/com-summarize-url', comSummarizeUrl);

// Commodity-related routes
app.get('/api/commodities', commodityController.getAllCommodities);
app.get('/api/moving-averages/:commodity', movingAverageController.getMovingAverages);

// WebSocket for live data updates
io.on('connection', (socket) => {
  console.log('New client connected');
  
  const collection = mongoose.connection.collection('Live_Datas');
  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newPrice = change.fullDocument;
      socket.emit('priceUpdate', newPrice);  // Send updated document to frontend
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(port, () => console.log(`Server is listening on port ${port}`));

// Custom logic for main functionality
require('./main')(app, MongoClient, mongoUrl, dbName);  // Pass app, MongoClient, and DB settings to main logic
