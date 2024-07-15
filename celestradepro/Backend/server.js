const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const router = require('./router');
const { MongoClient } = require('mongodb');
const dbName = 'FinanceDB';
const newsRoutes = require('./newsRoutes');
const fnewsRoutes = require('./fnewsRoutes');
const com_newsRoutes = require('./com_newsRoutes');
const comProfRouter = require('./comProfRouter');
const { fetchData, fetchAvailableDates } = require('./peggerController');
const optionnewsRoutes = require('./optionnewsRoutes');

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/FinanceDB';

mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB', err));

  const mongoose = require('mongoose');


app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);
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
