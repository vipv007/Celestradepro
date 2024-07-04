const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commoditys = new Schema({

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
  Symbol: {
    type: String
  },
  ask:
  {
    type:Number
  } , 
  bid:
  {
    type:Number
  },
  change:
  {type:Number},

 changepercentage:
    { type: Number }, // Removed the trailing comma here

  selected: {
    type: Boolean,
    default: false // Default value for selected field
  }
}, {
  collection: 'commoditys'
});

module.exports = mongoose.model('commoditys', commoditys);
