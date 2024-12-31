// Node.js controller code
const Options = require('./optionsModel');
exports.getOptions = (req, res) => {
    Options.find({}, (err, options) => {
        if (err) {
            res.send(err);
        }
        res.json(options);
    });
};
//# sourceMappingURL=optionsController.js.map