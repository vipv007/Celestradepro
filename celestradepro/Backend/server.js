require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// MongoDB Atlas connection
const mongoUrl = process.env.MONGO_URL || 'mongodb+srv://vipvenkatesh567:Nlddj1hFEyqKABsv@financedb.ntgkmgm.mongodb.net';
const dbName = process.env.DB_NAME || 'FinanceDB';

// Validate MongoDB config
if (!mongoUrl || !dbName) {
  console.error("❌ MONGO_URL and DB_NAME must be defined.");
  process.exit(1);
}

// Connect to MongoDB
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

// Schema and Model
const NameSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
const Name = mongoose.model('Name', NameSchema);

// API Routes
app.post('/api/name', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const nameEntry = new Name({ name });
    await nameEntry.save();
    res.status(201).json({ message: 'Name stored', name: nameEntry });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save name' });
  }
});

app.get('/api/name', async (req, res) => {
  try {
    const names = await Name.find();
    res.status(200).json(names);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve names' });
  }
});

// Socket.IO setup
const server = http.createServer(app);
const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('🟢 Client connected');

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

// Start server
server.listen(port, () => {
  console.log(`🚀 Backend server running on port ${port}`);
});
 