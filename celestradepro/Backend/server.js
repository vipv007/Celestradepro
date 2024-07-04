const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const router = require('./router');
const { MongoClient } = require('mongodb');
const mongoUrl = 'mongodb://127.0.0.1';
const dbName = 'FinanceDB';
const newsRoutes = require('./newsRoutes');
const fnewsRoutes = require('./fnewsRoutes');
const com_newsRoutes = require('./com_newsRoutes');
const comProfRouter = require('./comProfRouter');
const { fetchData,fetchAvailableDates  } = require('./peggerController');
const optionnewsRoutes = require('./optionnewsRoutes');

mongoose.connect('mongodb://127.0.0.1/FinanceDB', {
//mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Database connected');
}).catch((error) => {
  console.log('Database connection error', error);
});


app.use(bodyParser.json());
app.use(cors());
app.use('/api',router)
app.use('/api/news', newsRoutes);
app.use('/api/fnews', fnewsRoutes);
app.get('/api/data', fetchData);
app.get('/api/data/dates', fetchAvailableDates);
app.use('/api/com_news', com_newsRoutes);
app.use('/com-prof', comProfRouter);
app.use('/api/optionnews', optionnewsRoutes);

require('./main')(app, MongoClient, mongoUrl, dbName);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
//const server = app.listen(port, () => console.log(`Server listening on port ${port}`));
