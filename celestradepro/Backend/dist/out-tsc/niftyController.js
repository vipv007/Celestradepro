// Node.js controller code
const Nifty = require('./niftyModel');
exports.getNifty = (req, res) => {
    Nifty.find({}, (err, nifty) => {
        if (err) {
            res.send(err);
        }
        res.json(nifty);
    });
};
//# sourceMappingURL=niftyController.js.map