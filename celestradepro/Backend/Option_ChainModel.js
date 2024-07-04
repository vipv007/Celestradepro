const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Options = new Schema({

  symbol:{
    type: String
  },
  contractSymbol: {
    type: String
  },
  lastTradeDate: {
    type: Date
  },
  strikePrice:{
    type: String
  },
  lastPrice: {
    type: String
  }, 

  bid: {
    type: String
  },
  ask: {
    type: String
  },
  change: {
    type: String
  },
  percentChange: {
    type: String
  },
  volume: {
    type: String
  },
  openInterest: {
    type: String
  },
  impliedVolatility: {
    type: String
  },
  inTheMoney: {
    type: Boolean
  },
  contractSize:{
    type: String
  },
  currency:{
    type: String
  },
  expiryDate:{
    type: Date
  }
  


}, {
  collection: 'options'
})

module.exports = mongoose.model('Option', Options)