const Fnews = require('./fnewsModel');
exports.getAllFnews = (req, res) => {
    Fnews.find({}, (err, news) => {
        if (err) {
            res.send(err);
        }
        res.json(news);
    });
};
exports.archiveNews = (req, res) => {
    const { id } = req.params;
    Fnews.findByIdAndUpdate(id, { archive: true }, { new: true }, (err, article) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(article);
        }
    });
};
exports.restoreNews = (req, res) => {
    const { id } = req.params;
    Fnews.findByIdAndUpdate(id, { archive: false }, { new: true }, (err, article) => {
        if (err) {
            res.status(500).send(err);
        }
        res.json(article);
    });
};
//# sourceMappingURL=fnewsController.js.map