const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Optionnews = new Schema({

//  url:{
//   type: String
//  },
//  name:{
//   type: String
//  },
//  imgurl:{
//   type: String
//  }, 
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
fetchedTime: {
  type: Date
},
archive: {
  type: Boolean,
  default: false
}
}, {
  collection: 'op_news'
})

module.exports = mongoose.model('Optionnews', Optionnews)
