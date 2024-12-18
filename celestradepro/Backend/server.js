require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://finance.celespro.com', // Allow requests from any origin. Replace with your frontend URL if needed.
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,application/json'
}));

// MongoDB Connection
const mongoUrl = process.env.AZURE_COSMOS_CONNECTIONSTRING;
const dbName = process.env.DB_NAME;
mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Define Schema and Model
const NameSchema = new mongoose.Schema({ name: { type: String, required: true } });
const Name = mongoose.model('Name', NameSchema);

// === API Routes ===

// Store a name
app.post('/api/name', async (req, res) => {
  try {
    const { name } = req.body;
    const nameEntry = new Name({ name });
    await nameEntry.save();
    res.status(200).json({ message: 'Name stored successfully', name: nameEntry });
  } catch (error) {
    console.error('Error storing name:', error);
    res.status(500).json({ error: 'Failed to store name' });
  }
});

// Retrieve all stored names
app.get('/api/names', async (req, res) => {
  try {
    const names = await Name.find();
    res.status(200).json(names);
  } catch (error) {
    console.error('Error retrieving names:', error);
    res.status(500).json({ error: 'Failed to retrieve names' });
  }
});

// === Static File Serving for Frontend ===
app.use(express.static(path.join(__dirname, 'www')));

// Catch-all Route to Serve Frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
