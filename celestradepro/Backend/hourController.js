 // Node.js controller code
 const Hour = require('./hourModel');

 exports.getHour = (req, res) => {
   Hour.find({}, (err, hour) => {
     if (err) {
       res.send(err);
     }
     res.json(hour);
   });
 };