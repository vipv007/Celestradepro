require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

const mongoUrl = process.env.AZURE_COSMOS_CONNECTIONSTRING || 'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';
const dbName = process.env.DB_NAME || 'test';

console.log('Starting MongoDB setup...');
console.log('MongoDB Connection String:', mongoUrl);
console.log('Database Name:', dbName);

async function connectToDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    const startTime = Date.now();
    await mongoose.connect(`${mongoUrl}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const connectionTime = Date.now() - startTime;
    console.log(`Connected to MongoDB at ${mongoUrl}/${dbName} in ${connectionTime}ms`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with error
  }
}

// Middleware setup
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://finance.celespro.com' // Replace with your frontend's domain
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
    res.status(200).send({ message: 'Email stored successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to store email' });
  }
});

// Connect to the database and start the server
connectToDatabase().then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});
