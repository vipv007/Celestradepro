const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

const mongoUrl = process.env.AZURE_COSMOS_CONNECTIONSTRING || 'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';
const dbName = process.env.DB_NAME || 'test';

// Connect to MongoDB
mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://finance.celespro.com' // Allow frontend URL
}));

// Define Mongoose Model
const User = mongoose.model('User', new mongoose.Schema({
  email: String
}));

// Endpoint to store email
app.post('/api/login', async (req, res) => {
  try {
    const { email } = req.body;
    const user = new User({ email });
    await user.save();
    res.status(200).json({ message: 'Email stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to store email' });
  }
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
