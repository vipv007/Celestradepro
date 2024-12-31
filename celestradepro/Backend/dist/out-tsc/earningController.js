// Node.js controller code
const Earning = require('./earningModel');
exports.getAllEarnings = (req, res) => {
    Earning.find({}, (err, Earning) => {
        if (err) {
            res.send(err);
        }
        res.json(Earning);
    });
};
//# sourceMappingURL=earningController.js.map