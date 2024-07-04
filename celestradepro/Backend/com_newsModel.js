const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Com_news = new Schema({

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
  collection: 'com_news'
})

module.exports = mongoose.model('Com_news', Com_news)
