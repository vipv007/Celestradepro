require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./router');
const newsRoutes = require('./newsRoutes');
const fnewsRoutes = require('./fnewsRoutes');
const com_newsRoutes = require('./com_newsRoutes');
const comProfRouter = require('./comProfRouter');
const { fetchData, fetchAvailableDates } = require('./peggerController');
const optionnewsRoutes = require('./optionnewsRoutes');
const commodityController = require('./comvolController');
const movingAverageController = require('./movavgController');
const { MongoClient } = require('mongodb');

const app = express();
const mongoUrl = process.env.MONGO_URL || 'mongodb://meddy.sam%5Edatabase_147ea:Kuppanur%402020@svc-3482219c-a389-4079-b18b-d50662524e8a-shared-mongo.aws-virginia-6.svc.singlestore.com:27017/?authMechanism=PLAIN&tls=true&loadBalanced=true&dbName=database_147ea';
const dbName = process.env.DB_NAME || 'FinanceDB';

// MongoDB Connection
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  authSource: 'admin', // Specify the auth source if different from the database
  authMechanism: 'PLAIN', // Specify the auth mechanism
  tls: true
}).then(() => {
  console.log('Database connected');
}).catch((error) => {
  console.log('Database connection error', error);
});

app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api', router);
app.use('/api/news', newsRoutes);
app.use('/api/fnews', fnewsRoutes);
app.get('/api/data', fetchData);
app.get('/api/data/dates', fetchAvailableDates);
app.use('/api/com_news', com_newsRoutes);
app.use('/com-prof', comProfRouter); // Ensure this route is correct
app.use('/api/optionnews', optionnewsRoutes);
app.get('/api/commodities', commodityController.getAllCommodities);
app.get('/api/moving-averages/:commodity', movingAverageController.getMovingAverages);

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));

require('./main')(app, MongoClient, mongoUrl, dbName);
