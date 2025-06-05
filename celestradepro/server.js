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

// MongoDB connection setup
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'FinanceDB';

if (!mongoUrl || !dbName) {
    console.error("MONGO_URL and DB_NAME environment variables must be set.");
    process.exit(1);
}

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log(`Connected to MongoDB at ${mongoUrl}`))
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});

// CORS Configuration
const corsOptions = {
  origin: 'https://finance.celespro.com',  // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the Angular app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'www')));
}

// API Routes
app.use('/api', apiRoutes);

// All other GET requests not handled before will return the Angular app
app.get('*', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        res.sendFile(path.join(__dirname, 'www', 'index.html'));
    } else {
        res.status(404).send('Not Found');
    }
});

// Start server
const server = http.createServer(app);
const io = socketIO(server);
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => console.log(`Server is listening on port ${port}`));
