require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.AZURE_COSMOS_CONNECTIONSTRING;
const dbName = process.env.DB_NAME;

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log(`Connected to MongoDB at ${mongoUrl}/${dbName}`))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Middleware setup
app.use(express.json());
app.use(cors({
  origin: 'https://celescontainerwebapp-staging-b5g9ehgkhyb0dpe9.westus3-01.azurewebsites.net',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
}));


// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Define Mongoose Schema and Model
const NameSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Name = mongoose.model('Name', NameSchema);

// Backend API Endpoints
app.post('/api/name', async (req, res) => {
  console.log(`POST /api/name request body: ${JSON.stringify(req.body)}`);
  try {
    const { name } = req.body;
    const nameEntry = new Name({ name });
    await nameEntry.save();
    res.status(200).json({ message: 'Name stored successfully' });
  } catch (error) {
    console.error('Error storing name:', error);
    res.status(500).json({ error: 'Failed to store name' });
  }
});

app.get('/api/names', async (req, res) => {
  console.log('GET /api/names request received');
  try {
    const names = await Name.find();
    res.status(200).json(names);
  } catch (error) {
    console.error('Error retrieving names:', error);
    res.status(500).json({ error: 'Failed to retrieve names' });
  }
});

// Serve static files (Angular frontend)
app.use(express.static(path.join(__dirname, 'www')));

// Redirect all other routes to Angular's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
