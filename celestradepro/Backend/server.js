require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const port = process.env.PORT || 3000;

let mongoUrl = process.env.MONGO_URL; // Get from environment in Azure
const dbName = process.env.DB_NAME;     // Get from environment in Azure

if (!mongoUrl || !dbName) {
    console.error("MONGO_URL and DB_NAME environment variables must be set.");
    process.exit(1);
}

const server = http.createServer(app);
const io = socketIO(server);

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log(`Connected to MongoDB at ${mongoUrl}`))
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

app.use(bodyParser.json());
app.use(cors());

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

const NameSchema = new mongoose.Schema({ name: { type: String, required: true } });
const Name = mongoose.model('Name', NameSchema);

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

app.get('/api/name', async (req, res) => {
    try {
        const names = await Name.find();
        res.status(200).json(names);
    } catch (error) {
        console.error('Error retrieving names:', error);
        res.status(500).json({ error: 'Failed to retrieve names' });
    }
});

app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

server.listen(port, () => console.log(`Server is listening on port ${port}`));