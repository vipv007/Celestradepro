// Node.js controller code
const Openintrest = require('./openintrestModel');
exports.getOpenintrest = (req, res) => {
    Openintrest.find({}, (err, openintrest) => {
        if (err) {
            res.send(err);
        }
        res.json(openintrest);
    });
};
//# sourceMappingURL=openintrestController.js.map