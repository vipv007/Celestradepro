const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let hour = new Schema({


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
  collection: 'hour'
})

module.exports = mongoose.model('hour', hour)



