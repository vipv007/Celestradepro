const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Fx_news = new Schema({
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
  articleDateTime: {
    type: String
  },
  archive: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'Fx_news'
});

module.exports = mongoose.model('Fx_news', Fx_news);
