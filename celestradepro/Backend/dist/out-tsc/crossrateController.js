// Node.js controller code
const crossrate = require('./crossrateModel');
exports.getCrossrate = (req, res) => {
    crossrate.find({}, (err, crossrate) => {
        if (err) {
            res.send(err);
        }
        res.json(crossrate);
    });
};
//# sourceMappingURL=crossrateController.js.map