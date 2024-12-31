// Node.js controller code
const screener = require('./screenerModel');
exports.getAllScreener = (req, res) => {
    screener.find({}, (err, screener) => {
        if (err) {
            res.send(err);
        }
        res.json(screener);
    });
};
//# sourceMappingURL=screenerController.js.map