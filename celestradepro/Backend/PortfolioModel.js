const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let portfolio = new Schema({
 
  ticker_symbols: {
    type: String
  },
  stock: {
    type: String
  },
   type: {
    type: String
  },
    order: {
    type: String
  },
  today_price: {
    type: String
  },
  quantity: {
    type: String
  },
  
  total_shares: {
    type: String
  },
  totalamount: {
    type: String
  },
  quantity:{
    type: Number
  },
  price:{
    type: Number
  },
  triggerprice: {
    type: Number
  },
  target:{
    type : Number
  },
  stoploss: {
    type: Number
  },
  trailingstoploss:{
    type: Number
  },
  selectedOrderType:{
    type:String
  },
  selectedDateTime:{
    type:Date
  },
  credit:{
    type : Number
  },
  margininitial:{
    type : Number
  },
  marginmaint:{
    type : Number
  },

  },
 {
  collection: 'portfolio'
})

module.exports = mongoose.model('portfolio', portfolio)
