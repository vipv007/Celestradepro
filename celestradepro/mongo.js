const mongoose = require('mongoose');

// Connection URL
const url = 'mongodb://localhost:27017/my_database';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});
