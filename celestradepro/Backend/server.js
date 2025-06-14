// Load environment variables
require('dotenv').config();

// Required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection settings
const mongoUrl = process.env.MONGO_URL || 'mongodb+srv://vipvenkatesh567:Nlddj1hFEyqKABsv@financedb.ntgkmgm.mongodb.net';
const dbName = process.env.DB_NAME || 'FinanceDB';

// Validate MongoDB configuration
if (!mongoUrl || !dbName) {
  console.error("❌ MONGO_URL and DB_NAME must be defined.");
  process.exit(1);
}

// Connect to MongoDB Atlas
mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Define schema and model
const NameSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
const Name = mongoose.model('Name', NameSchema);

// API Routes
app.post('/api/name', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const nameEntry = new Name({ name });
  await nameEntry.save();
  res.status(201).json({ message: 'Name stored', name: nameEntry });
});

app.get('/api/name', async (req, res) => {
  const names = await Name.find();
  res.status(200).json(names);
});

// Create HTTP server for Socket.IO
const server = http.createServer(app);
const io = socketIO(server);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('🟢 Client connected');

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

// Start backend server
server.listen(port, () => {
  console.log(`🚀 Backend server running on port ${port}`);
});
