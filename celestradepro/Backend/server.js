require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const http = require('http');
const socketIO = require('socket.io');

// Import routes and controllers
// const router = require('./router');

const app = express();
const port = process.env.PORT || 3000;

let mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'; // Use 'let' here
const dbName = process.env.DB_NAME || 'FinanceDB';

// Use Azure Cosmos DB connection string if available
if (process.env.AZURE_COSMOS_CONNECTIONSTRING) {
    mongoUrl = process.env.AZURE_COSMOS_CONNECTIONSTRING;
}

console.log('MongoDB Connection String:', mongoUrl); // Log the actual connection string used
console.log('Database Name:', dbName);


const server = http.createServer(app);
const io = socketIO(server);

mongoose.connect(mongoUrl, { // Use the potentially updated mongoUrl
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log(`Connected to MongoDB at ${mongoUrl}`))
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process if the database connection fails
    });

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// API Routes


// WebSocket for live data updates
io.on('connection', (socket) => {
    console.log('New client connected');

    const collection = mongoose.connection.collection('Live_Datas');
    const changeStream = collection.watch();

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            const newPrice = change.fullDocument;
            socket.emit('priceUpdate', newPrice);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
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
        res.status(200).json({ message: 'Name stored successfully', name: nameEntry }); //Explicitly send json
    } catch (error) {
        console.error('Error storing name:', error);
        res.status(500).json({ error: 'Failed to store name' }); //Explicitly send json
    }
});

// Retrieve all stored names
app.get('/api/name', async (req, res) => {
    try {
        const names = await Name.find();
        res.status(200).json(names); //Explicitly send json
    } catch (error) {
        console.error('Error retrieving names:', error);
        res.status(500).json({ error: 'Failed to retrieve names' }); //Explicitly send json
    }
});

// Error handling middleware (MUST be defined LAST)
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack); // Log the full stack trace
    res.status(500).json({ error: 'Internal Server Error' }); //Send json response
});

// Start the server
server.listen(port, () => console.log(`Server is listening on port ${port}`));
