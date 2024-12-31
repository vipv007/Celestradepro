const Optionnews = require('./optionnewsModel');
exports.getOptionnews = (req, res) => {
    Optionnews.find({}, (err, optionnews) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(optionnews);
        }
    });
};
exports.archiveOptionnews = (req, res) => {
    const { id } = req.params;
    Optionnews.findByIdAndUpdate(id, { archive: true }, { new: true }, (err, article) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (!article) {
            res.status(404).send('Article not found');
        }
        else {
            res.json(article);
        }
    });
};
exports.restoreOptionnews = (req, res) => {
    const { id } = req.params;
    Optionnews.findByIdAndUpdate(id, { archive: false }, { new: true }, (err, article) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (!article) {
            res.status(404).send('Article not found');
        }
        else {
            res.json(article);
        }
    });
};
//# sourceMappingURL=optionnewsController.js.map