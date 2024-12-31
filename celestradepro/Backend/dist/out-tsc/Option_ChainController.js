// Node.js controller code
const Options = require('./Option_ChainModel');
exports.getoptions = (req, res) => {
    Options.find({}, (err, optionschain) => {
        if (err) {
            res.send(err);
        }
        res.json(optionschain);
    });
};
//# sourceMappingURL=Option_ChainController.js.map