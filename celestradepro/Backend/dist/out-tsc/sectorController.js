// Node.js controller code
const Sector = require('./sectorModel');
exports.getSector = (req, res) => {
    Sector.find({}, (err, sector) => {
        if (err) {
            res.send(err);
        }
        res.json(sector);
    });
};
//# sourceMappingURL=sectorController.js.map