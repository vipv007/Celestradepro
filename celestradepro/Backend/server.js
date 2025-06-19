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
const path = require('path');

// ───────────────────────────────────────────────
// ⚙️ Configuration from env
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGO_URI;


if (!mongoUri) {
  console.error('❌ MONGO_URI not set in environment!');
  process.exit(1);
}

// ───────────────────────────────────────────────
// 🗄️ Connect to MongoDB Atlas
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ───────────────────────────────────────────────
// 🛡️ Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json());

// ───────────────────────────────────────────────
// 📘 Mongoose Model
const EmailSchema = new mongoose.Schema({
  email: { type: String, required: true }
});
const Email = mongoose.model('Email', EmailSchema);

// ───────────────────────────────────────────────
// 🧩 API Route
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
// 🌐 Serve Angular app (if deployed together)
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for Angular routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// ───────────────────────────────────────────────
// 🚀 Start server
server.listen(port, () => {
  console.log(`🌍 Server running on port ${port}`);
});
