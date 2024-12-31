// Node.js controller code
const trend = require('./trendsModel');
exports.getAllTrends = (req, res) => {
    trend.find({}, (err, trends) => {
        if (err) {
            res.send(err);
        }
        res.json(trends);
    });
};
//# sourceMappingURL=trendsController.js.map