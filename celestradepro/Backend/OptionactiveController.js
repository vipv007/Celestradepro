// Node.js controller code
const Active = require('./OptionactiveModel');

exports.getAllActive = (req, res) => {
  Active.find({}, (err, Active) => {
    if (err) {
      res.send(err);
    }
    res.json(Active);
  });
};
