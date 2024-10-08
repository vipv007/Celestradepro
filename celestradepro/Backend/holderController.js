 // Node.js controller code
 const Holder = require('./holderModel');

 exports.getHolder = (req, res) => {
   Holder.find({}, (err, holder) => {
     if (err) {
       res.send(err);
     }
     res.json(holder);
   });
 };