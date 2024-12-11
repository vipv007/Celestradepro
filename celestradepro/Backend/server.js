require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

// Import user and news routes
const router = require('./router');
const newsRoutes = require('./newsRoutes');
const userRoutes = require('./userRoutes'); // Correctly import userRoutes

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.AZURE_COSMOS_CONNECTIONSTRING || 'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';
const dbName = process.env.DB_NAME || 'test';

console.log('MongoDB Connection String:', mongoUrl);
console.log('Database Name:', dbName);

const server = http.createServer(app);
const io = socketIO(server);

// Optimize Mongoose Connection
mongoose.set('strictQuery', false);


mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  connectTimeoutMS: 30000, // Increase connection timeout to 30 seconds
})
  .then(() => console.log(`Connected to MongoDB at ${mongoUrl}/${dbName}`))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process with failure
  });




// Middleware setup
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://celescontainerwebapp-staging-b5g9ehgkhyb0dpe9.westus3-01.azurewebsites.net',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// API Routes
app.use('/api', router);
app.use('/api/news', newsRoutes);
app.use('/api/users', userRoutes); // Add user routes for user operations

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
require('./main')(app);  // Pass app to main logic
