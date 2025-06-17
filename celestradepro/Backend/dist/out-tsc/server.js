var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const apiRoutes = require('./routes/api'); // Import API routes
const app = express();
const port = process.env.PORT || 3000;
// MongoDB connection setup
const mongoUrl = 'mongodb+srv://vipvenkatesh567:venkat123@financedb.ntgkmgm.mongodb.net/?retryWrites=true&w=majority&appName=FinanceDB';
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
    origin: 'https://finance.celespro.com', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
// MongoDB schema and model
const NameSchema = new mongoose.Schema({
    name: { type: String, required: true },
});
const Name = mongoose.model('Name', NameSchema);
// POST /api/name
app.post('/api/name', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }
        const nameEntry = new Name({ name });
        yield nameEntry.save();
        res.status(201).json({ message: 'Name stored successfully', name: nameEntry });
    }
    catch (error) {
        console.error('Error storing name:', error);
        res.status(500).json({ error: 'Failed to store name' });
    }
}));
// GET /api/name
app.get('/api/name', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const names = yield Name.find();
        res.status(200).json(names);
    }
    catch (error) {
        console.error('Error retrieving names:', error);
        res.status(500).json({ error: 'Failed to retrieve names' });
    }
}));
// Serve Angular app for static files
app.use(express.static(path.join(__dirname, 'www')));
// Angular route handler for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www/index.html'));
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
//# sourceMappingURL=server.js.map