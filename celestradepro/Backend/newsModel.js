const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let News = new Schema({
  url: {
    type: String
  },
  headline: {
    type: String
  },
  summary: {
    type: String
  },
  sentimentScore: {
    type: Number
  },
  sentiment: {
    type: String
  },
  fetchedTime: {
    type: Date
  },
  archive: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'st_news'
});

module.exports = mongoose.model('News', News);
