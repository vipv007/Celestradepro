// Backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const apiRoutes = require('./Backend/routes/api');  // Import API routes

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the Angular app
app.use(express.static(path.join(__dirname, 'www')));

// MongoDB connection setup
const mongoUrl = 'mongodb+srv://vipvenkatesh567:venkat123@financedb.ntgkmgm.mongodb.net/?retryWrites=true&w=majority&appName=FinanceDB';
// const dbName = process.env.DB_NAME || 'FinanceDB';

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection with retry logic
const connectWithRetry = () => {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`Connected to MongoDB at ${mongoUrl}`))
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        console.log('Retrying in 5 seconds...');
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// API routes
app.use('/api', apiRoutes);

// All other routes should serve the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/index.html'));
});

// Create HTTP server
const server = http.createServer(app);

// Socket.IO setup
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

// Start server
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
