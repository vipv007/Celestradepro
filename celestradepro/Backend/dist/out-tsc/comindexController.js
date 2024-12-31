// Node.js controller code
const comindex = require('./comindexModel');
exports.getComindex = (req, res) => {
    comindex.find({}, (err, comindex) => {
        if (err) {
            res.send(err);
        }
        res.json(comindex);
    });
};
//# sourceMappingURL=comindexController.js.map