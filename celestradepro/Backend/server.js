// Backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Database Configuration
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'FinanceDB';

if (!mongoUrl || !dbName) {
    console.error("MONGO_URL and DB_NAME environment variables must be set.");
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(`${mongoUrl}/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(`Connected to MongoDB at ${mongoUrl}`))
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

// Middleware Setup
app.use(cors({
    origin: 'https://finance.celespro.com', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(bodyParser.json());

// MongoDB Schema and Model
const NameSchema = new mongoose.Schema({
    name: { type: String, required: true },
});
const Name = mongoose.model('Name', NameSchema);

// API Endpoints
app.post('/api/name', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const nameEntry = new Name({ name });
        await nameEntry.save();
        res.status(201).json({ message: 'Name stored successfully', name: nameEntry });
    } catch (error) {
        console.error('Error storing name:', error);
        res.status(500).json({ error: 'Failed to store name' });
    }
});

app.get('/api/name', async (req, res) => {
    try {
        const names = await Name.find();
        res.status(200).json(names);
    } catch (error) {
        console.error('Error retrieving names:', error);
        res.status(500).json({ error: 'Failed to retrieve names' });
    }
});

// Serve Angular Static Files
const angularBuildPath = path.join(__dirname, 'www');
app.use(express.static(angularBuildPath));

// Fallback Route for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(angularBuildPath, 'index.html'));
});

// Set up Socket.IO
const server = http.createServer(app);
const io = socketIO(server);
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the Server
server.listen(port, () => console.log(`Server is listening on port ${port}`));
