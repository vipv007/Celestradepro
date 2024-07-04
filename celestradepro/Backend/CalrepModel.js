const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Calendarrep = new Schema({
  
Time: {
    type: String
  },
 Country: {
  type: String
  },
  
 Event: {
    type: String
},
 
 Actual: {
    type: String
  },
 
  Forecast: {
    type: String
},
Previous: {
    type : String
  }


  },
 {
  collection: 'Calendarrep'
})

module.exports = mongoose.model('Calendarrep', Calendarrep)
