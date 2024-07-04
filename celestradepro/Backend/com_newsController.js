// Node.js controller code
const Com_news = require('./com_newsModel');

exports.getCom_news = (req, res) => {
  Com_news.find({}, (err, com_news) => {
    if (err) {
      res.send(err);
    }
    res.json(com_news);
  });
};
exports.archiveCom_news = (req, res) => {
  const { id } = req.params;
  Com_news.findByIdAndUpdate(id, { archive: true }, { new: true }, (err, article) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(article);
    }
  });
};

exports.restoreCom_news = (req, res) => {
  const { id } = req.params;
  Com_news.findByIdAndUpdate(id, { archive: false }, { new: true }, (err, article) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(article);
  });
};
