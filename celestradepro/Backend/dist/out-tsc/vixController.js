// Node.js controller code
const vix = require('./vixModel');
exports.getVix = (req, res) => {
    vix.find({}, (err, vix) => {
        if (err) {
            res.send(err);
        }
        res.json(vix);
    });
};
//# sourceMappingURL=vixController.js.map