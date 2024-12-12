require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

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
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000
})
  .then(() => console.log(`Connected to MongoDB at ${mongoUrl}/${dbName}`))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://celescontainerwebapp-staging-b5g9ehgkhyb0dpe9.westus3-01.azurewebsites.net',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Define Mongoose Model for Name
const NameSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Name = mongoose.model('Name', NameSchema);

// Endpoint to store name
app.post('/api/name', async (req, res) => {
  try {
    const { name } = req.body;
    const nameEntry = new Name({ name });
    await nameEntry.save();
    res.status(200).json({ message: 'Name stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to store name' });
  }
});

// Endpoint to get all names
app.get('/api/names', async (req, res) => {
  try {
    const names = await Name.find();
    res.status(200).json(names);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve names' });
  }
});

// WebSocket for live data updates
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(port, () => console.log(`Server is listening on port ${port}`));

// Custom logic for main functionality
require('./main')(app);  // Pass app to main logic
