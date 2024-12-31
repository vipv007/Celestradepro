// Node.js controller code
const Ratios = require('./ratioModel');
exports.getAllRatios = (req, res) => {
    Ratios.find({}, (err, ratios) => {
        if (err) {
            res.send(err);
        }
        res.json(ratios);
    });
};
//# sourceMappingURL=ratioController.js.map