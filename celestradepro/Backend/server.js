require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const apiRoutes = require('./routes/api'); // Import the external API routes from api.js

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection setup
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'FinanceDB';

if (!mongoUrl || !dbName) {
    console.error("MONGO_URL and DB_NAME environment variables must be set.");
    process.exit(1);
}

// MongoDB connection
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log(`Connected to MongoDB at ${mongoUrl}`))
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

// CORS Configuration
const corsOptions = {
  origin: 'https://finance.celespro.com',  // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware setup
app.use(bodyParser.json());

// Serve Angular app for static files
app.use(express.static(path.join(__dirname, 'www')));

// MongoDB schema and model
const NameSchema = new mongoose.Schema({
    name: { type: String, required: true },
});
const Name = mongoose.model('Name', NameSchema);

// POST /api/name
app.post('/name', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const nameEntry = new Name({ name });
    await nameEntry.save();
    res.status(201).json({ message: 'Name stored successfully', name: nameEntry });
  } catch (error) {
    console.error('Error storing name:', error);
    res.status(500).json({ error: 'Failed to store name' });
  }
});

// GET /api/name
app.get('/api/name', async (req, res) => {
  try {
    const names = await Name.find();
    res.status(200).json(names);
  } catch (error) {
    console.error('Error retrieving names:', error);
    res.status(500).json({ error: 'Failed to retrieve names' });
  }
});

// External API routes from api.js
app.use('/', apiRoutes);

// Socket.IO setup for real-time data
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New client connected');
  const collection = mongoose.connection.collection('Live_Datas');
  const changeStream = collection.watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newPrice = change.fullDocument;
      socket.emit('priceUpdate', newPrice);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Angular route handler for SPA
app.get('*', (req, res) => {
  if (!req.path.startsWith('/')) {
    res.sendFile(path.join(__dirname, 'www'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
server.listen(port, () => console.log(`Server is listening on port ${port}`));
