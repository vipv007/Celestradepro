const Gainer = require('./fortopgainerModel');

exports.getAllGainers = (req, res) => {
    Gainer.find({}, (err, gainers) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(gainers);
        }
    });
};

exports.getTopGainersAndLosers = (req, res) => {
    Gainer.find({}, (err, gainers) => {
        if (err) {
            res.status(500).send(err);
        } else {
            // Sort by Change and Changeper
            const sortedByChange = [...gainers].sort((a, b) => b.Change - a.Change);
            const sortedByChangeper = [...gainers].sort((a, b) => {
                const aChangeper = parseFloat(a.Changeper.replace('%', ''));
                const bChangeper = parseFloat(b.Changeper.replace('%', ''));
                return bChangeper - aChangeper;
            });

            // Get top 10 gainers and losers
            const topGainers = sortedByChange.slice(0, 10);
            const topLosers = sortedByChange.slice(-10).reverse();

            // Send response
            res.json({
                topGainers: topGainers,
                topLosers: topLosers
            });
        }
    });
};
