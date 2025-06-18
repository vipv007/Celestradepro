// ───────────────────────────────────────────────
// 🔧 Load environment variables
require('dotenv').config();

// ───────────────────────────────────────────────
// 📦 Required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

// ───────────────────────────────────────────────
// 🚀 Initialize express app and server
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// ───────────────────────────────────────────────
// ⚙️ Configuration
const port = 3000;
const mongoUrl = 'mongodb+srv://vipvenkatesh567:venkat123@financedb.ntgkmgm.mongodb.net';
const dbName = 'FinanceDB';

if (!mongoUrl || !dbName) {
  console.error("❌ mongoUrl or dbName missing");
  process.exit(1);
}

// ───────────────────────────────────────────────
// 🗄️ Connect to MongoDB Atlas
mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ───────────────────────────────────────────────
// 🛡️ Middleware
app.use(cors({
  origin: '*', // Update if needed for production security
  credentials: true
}));
app.use(bodyParser.json());

const path = require('path');

// Serve Angular files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for Angular routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


// ───────────────────────────────────────────────
// 📘 Mongoose Model
const EmailSchema = new mongoose.Schema({
  email: { type: String, required: true }
});
const Email = mongoose.model('Email', EmailSchema);

// ───────────────────────────────────────────────
// 🧩 API Routes
app.post('/api/store-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const newEmail = new Email({ email });
    await newEmail.save();

    console.log('✅ Received and stored email:', email);
    res.status(200).json({ message: 'Email stored successfully' });
  } catch (error) {
    console.error('❌ Error storing email:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ───────────────────────────────────────────────
// 🔌 WebSocket Setup
io.on('connection', (socket) => {
  console.log('🟢 WebSocket client connected');
  socket.on('disconnect', () => console.log('🔴 Client disconnected'));
});

// ───────────────────────────────────────────────
// 🚀 Start backend server
server.listen(port, () => {
  console.log(`🌐 Backend server running on http://localhost:${port}`);
});
