const frxindex = require('./frxindexModel'); // Ensure you are requiring the correct model
exports.getFrxindex = (req, res) => {
    frxindex.find({}, (err, frxindex) => {
        if (err) {
            res.send(err);
        }
        res.json(frxindex);
    });
};
//# sourceMappingURL=frxindexController.js.map