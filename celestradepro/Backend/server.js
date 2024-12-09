require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

// Import routes and controllers
const router = require('./router');

const app = express();

app.use(cors({
  origin: 'https://finance.celespro.com' // Replace with your frontend's domain
}));

const port = process.env.PORT || 8080;
const mongoUrl = process.env.AZURE_COSMOS_CONNECTIONSTRING || 'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';
const dbName = process.env.DB_NAME || 'test';

console.log('MongoDB Connection String:', mongoUrl);
console.log('Database Name:', dbName);

const server = http.createServer(app);
const io = socketIO(server);

mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log(`Connected to MongoDB at ${mongoUrl}/${dbName}`);
    // Only start the server after a successful database connection
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
      // Load the main functionality once the server is ready
      require('./main')(app, mongoose, mongoUrl, dbName); 
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process with failure
  });

// Middleware setup
app.use(bodyParser.json());

// API Routes
app.use('/api', router);

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
