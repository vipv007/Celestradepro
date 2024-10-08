 // Node.js controller code
 const Dividend = require('./dividendModel');

 exports.getDividend= (req, res) => {
   Dividend.find({}, (err, dividend) => {
     if (err) {
       res.send(err);
     }
     res.json(dividend);
   });
 };