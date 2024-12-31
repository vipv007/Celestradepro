const Insider = require('./insiderModel');
exports.getInsider = (req, res) => {
    Insider.find({}, (err, insider) => {
        if (err) {
            res.send(err);
        }
        res.json(insider);
    });
};
//# sourceMappingURL=insiderController.js.map