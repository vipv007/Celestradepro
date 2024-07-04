const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FrxindexSchema = new Schema({
  Name: {
    type: String
  },
  Last: {
    type: String
  },
  High: {
    type: String
  },
  Low: {
    type: String
  },
  Chg: {
    type: String
  },
  Time: {
    type: Number
  }
}, {
  collection: 'Frxindex'
});

module.exports = mongoose.model('Frxindex', FrxindexSchema);
