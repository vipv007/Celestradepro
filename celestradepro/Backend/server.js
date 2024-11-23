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

// Initialize Express app and server settings
const app = express();
const port = 443;
const mongoUrl = 'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';
const dbName = 'test';

// MongoDB connection
mongoose
  .connect(`${mongoUrl}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to MongoDB at ${mongoUrl}/${dbName}`))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware setup
app.use(bodyParser.json());
app.use(
  cors({
    origin: 'https://celescontainerwebapp-staging-b5g9ehgkhyb0dpe9.westus3-01.azurewebsites.net',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.options('*', cors()); // Handle preflight requests globally

// WebSocket setup
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New client connected');
  const collection = mongoose.connection.collection('Live_Datas');
  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newPrice = change.fullDocument;
      socket.emit('priceUpdate', newPrice); // Send updated document to frontend
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API Routes
app.use('/api', router);

// Start the server
server.listen(port, () => console.log(`Server is listening on port ${port}`));
