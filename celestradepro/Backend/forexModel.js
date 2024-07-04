const mongoose = require('mongoose');

let forexSchema = new mongoose.Schema({

 symbol:{
   type: String
    },
 date:{
  type: Date
 },
 Open:{
  type: String
 },
 High:{
  type: String
 },
 Low:{
  type: String
 },
 Close:{
  type: String
 },
 Volume:{
  type: String
 },
 Adj_Close:{
    type: String
 },
 selected: {
   type: Boolean,
   default: false // Default value for selected field
 }
},
{
 collection: 'forex'
})

module.exports = mongoose.model('Forex', forexSchema)