const News = require('./newsModel');

exports.getAllNews = (req, res) => {
  News.find({}, (err, news) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(news);
  });
};

exports.archiveNews = (req, res) => {
  const { id } = req.params;
  News.findByIdAndUpdate(id, { archive: true }, { new: true }, (err, article) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(article);
    }
  });
};

exports.restoreNews = (req, res) => {
  const { id } = req.params;
  News.findByIdAndUpdate(id, { archive: false }, { new: true }, (err, article) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(article);
  });
};
