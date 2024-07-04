const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let technical = new Schema({


symbol:{
  type: String
},

CompanyName:{
  type:String
},
industry:{
  type:String
},

series:{
  type:String
},
ISINCode:{
  type:String
}
},
{
  collection: 'technical'
})

module.exports = mongoose.model('technical', technical)



