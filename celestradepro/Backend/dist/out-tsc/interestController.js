// Node.js controller code
const Interest = require('./interestModel');
exports.getAllInterests = (req, res) => {
    Interest.find({}, (err, interests) => {
        if (err) {
            res.send(err);
        }
        res.json(interests);
    });
};
//# sourceMappingURL=interestController.js.map