 // Node.js controller code
 const Technical = require('./technicalModel');

 exports.getTechnical = (req, res) => {
   Technical.find({}, (err, technical) => {
     if (err) {
       res.send(err);
     }
     res.json(technical);
   });
 };