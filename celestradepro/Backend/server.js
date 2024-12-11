const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// MongoDB connection string and database name
const mongoUrl = process.env.AZURE_COSMOS_CONNECTIONSTRING || 'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';
const dbName = process.env.DB_NAME || 'test';

// Connect to MongoDB
mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://celescontainerwebapp-staging-b5g9ehgkhyb0dpe9.westus3-01.azurewebsites.net', // Allow frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}));

// Define Mongoose Model for User
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  watchlist: Array,
  theme: String,
  selectedSections: Array,
  archivedArticles: Array,
  archivedOptionArticles: Array,
  archivedCommodityArticles: Array,
  archivedForexArticles: Array
}));

// Endpoint to store email
app.post('/api/store-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = new User({ email });
    await user.save();
    res.status(200).json({ message: 'Email stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to store email' });
  }
});

// Endpoint to get user theme
app.get('/api/user-theme/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    res.status(200).json({ theme: user.theme });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch theme' });
  }
});

// Endpoint to update user theme
app.post('/api/update-user-theme', async (req, res) => {
  try {
    const { email, theme } = req.body;
    await User.updateOne({ email }, { theme });
    res.status(200).json({ message: 'Theme updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

// Endpoint to get user data
app.post('/api/login', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Endpoint to update selected sections for the user
app.post('/api/update-selected-sections', async (req, res) => {
  try {
    const { email, selectedSections } = req.body;
    await User.updateOne({ email }, { selectedSections });
    res.status(200).json({ message: 'Selected sections updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update selected sections' });
  }
});

// Endpoint to handle archiving for users
app.post('/api/users/:email/archive', async (req, res) => {
  try {
    const { email } = req.params;
    const archivedArticle = req.body;
    await User.updateOne({ email }, { $push: { archivedArticles: archivedArticle } });
    res.status(200).json({ message: 'Article archived successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive article' });
  }
});

// Endpoint to get archived articles for the user
app.get('/api/archive/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    res.status(200).json(user.archivedArticles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get archived articles' });
  }
});

// Repeat similar endpoints for option articles, commodity articles, and forex articles

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
