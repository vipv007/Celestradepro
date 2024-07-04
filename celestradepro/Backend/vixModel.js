const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Vix = new Schema({
 
  symbol:{
    type: String
  },
  open: {
    type: Number
  },
  high: {
    type: Number
  },
  low: {
    type: Number
  },
 
  close: {
    type: Number
  },
  volume: {
    type: Number
  },
  adi_close:{
    type:String
  } 

}, {
  collection: 'Vix'
})

module.exports = mongoose.model('Vix', Vix)
