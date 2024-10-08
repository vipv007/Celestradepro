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


exports.getTopNewsBySentiment = (req, res) => {
    // Fetch all news articles
    News.find({}, (err, newsArticles) => {
        if (err) {
           // console.error('Error fetching news:', err);
            return res.status(500).send(err);
        }

        //console.log('Fetched news articles:', newsArticles);

        // Check if articles exist
        if (newsArticles.length === 0) {
            return res.status(404).send('No news articles found');
        }

        // Sort by sentimentScore in descending order
        const sortedBySentiment = [...newsArticles].sort((a, b) => b.sentimentScore - a.sentimentScore);

        // Get top 10 news articles
        const topSentimentNews = sortedBySentiment.slice(0, 5);

        console.log('Top 10 Sentiment News:', topSentimentNews);

        // Send response
        res.json(topSentimentNews);
    });
};





