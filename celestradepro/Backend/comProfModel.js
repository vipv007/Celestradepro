const mongoose = require('mongoose');

const comProfSchema = new mongoose.Schema({
  country: String,
  currency: String,
  estimateCurrency: String,
  exchange: String,
  finnhubIndustry: String,
  founded: String,
  logo: String,
  marketCapitalization: Number,
  name: String,
  phone: String,
  shareOutstanding: Number,
  ticker: String,
  weburl: String,
}, { collection: 'com_prof' });

module.exports = mongoose.model('Comprof', comProfSchema);
