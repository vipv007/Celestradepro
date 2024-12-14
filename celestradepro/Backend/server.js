require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();
const port = 3000;
const mongoUrl = 'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';
const dbName = 'test';

console.log('MongoDB Connection String:', mongoUrl);
console.log('Database Name:', dbName);

// Connect to MongoDB
mongoose.set('strictQuery', false);
mongoose.connect(`${mongoUrl}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log(`Connected to MongoDB at ${mongoUrl}/${dbName}`))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.url}`);
  next();
});

// Define Mongoose Model for Name
const NameSchema = new mongoose.Schema({
  name: { type: String, required: true },
});
const Name = mongoose.model('Name', NameSchema);

// API routes
app.post('/api/name', async (req, res) => {
  console.log(`POST /api/name request body: ${JSON.stringify(req.body)}`);
  try {
    const { name } = req.body;
    const nameEntry = new Name({ name });
    await nameEntry.save();
    res.status(200).json({ message: 'Name stored successfully' });
  } catch (error) {
    console.error(`Error storing name: ${error}`);
    res.status(500).json({ error: 'Failed to store name' });
  }
});

app.get('/api/names', async (req, res) => {
  console.log('GET /api/names request received');
  try {
    const names = await Name.find();
    res.status(200).json(names);
  } catch (error) {
    console.error(`Error retrieving names: ${error}`);
    res.status(500).json({ error: 'Failed to retrieve names' });
  }
});

// Serve static files from the Angular frontend app
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start the server
app.listen(port, () => console.log(`Server is listening on port ${port}`));
