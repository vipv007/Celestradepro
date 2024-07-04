const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Active = new Schema({

  Name:{
    type: String
   },
   Symbol:{
    type: String
   },
   Last:{
    type: String
   },


}, {
  collection: 'Most-Active-Options'
})

module.exports = mongoose.model('Active', Active)
