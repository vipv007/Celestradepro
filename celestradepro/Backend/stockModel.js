const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Stock = new Schema({

  Open: {
    type: Number
  },
  High: {
    type: Number
  },
  Low: {
    type: Number
  },
 
  Close: {
    type: Number
  },
  Volume: {
    type: Number
  },
  
  selected: {
    type: Boolean,
    default: false // Default value for selected field
  }
},
 {
  collection: 'Stock'
})

module.exports = mongoose.model('Stock', Stock)
