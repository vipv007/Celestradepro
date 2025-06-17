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
const mongoUrl ='mongodb+srv://vipvenkatesh567:venkat123@financedb.ntgkmgm.mongodb.net/?retryWrites=true&w=majority&appName=FinanceDB';
// const dbName = process.env.DB_NAME || 'FinanceDB';

// Validate MongoDB configuration
if (!mongoUrl || !dbName) {
  console.error("❌ MONGO_URL and DB_NAME must be defined.");
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
  origin: 'https://celweb-dpbwcshbe5btg2ep.westus3-01.azurewebsites.net', // Allow frontend domain
  credentials: true
}));
app.use(bodyParser.json());

// ───────────────────────────────────────────────
// 📘 Mongoose Model
const NameSchema = new mongoose.Schema({
  name: { type: String, required: true }
});
const Name = mongoose.model('Name', NameSchema);

// ───────────────────────────────────────────────
// 🧩 API Routes
// POST /api/name
app.post('/api/name', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  names.push({ name });
  res.status(201).json({ message: 'Name stored successfully' });
});

// GET /api/name
app.get('/api/name', (req, res) => {
  res.json(names);
});


// app.get('/api/name', async (req, res) => {
//   try {
//     const names = await Name.find();
//     res.status(200).json(names);
//   } catch (error) {
//     console.error('❌ GET /api/name error:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// app.post('/api/name', async (req, res) => {
//   const { name } = req.body;
//   if (!name) return res.status(400).json({ error: 'Name is required' });

//   const nameEntry = new Name({ name });
//   await nameEntry.save();
//   res.status(201).json({ message: 'Name stored', name: nameEntry });
// });


// ───────────────────────────────────────────────
// 🔌 WebSocket Setup
io.on('connection', (socket) => {
  console.log('🟢 Client connected via WebSocket');

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected');
  });
});

// ───────────────────────────────────────────────
// 🚀 Start backend server
server.listen(port, () => {
  console.log(`🌐 Backend server running on port ${port}`);
});
