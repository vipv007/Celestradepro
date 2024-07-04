const Cgainer = require('./commoditygainerModel');

// Get all commodity gainers
exports.getAllComGainers = (req, res) => {
    Cgainer.find({}, (err, cgainers) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(cgainers);
    });
};

// Get top gainers and losers
exports.getComGainersLosers = (req, res) => {
    Cgainer.find({}, (err, cgainers) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Sort by Change and Changeper
        const sortedByChange = [...cgainers].sort((a, b) => b.Change - a.Change);
        const sortedByChangeper = [...cgainers].sort((a, b) => {
            const aChangeper = parseFloat(a.Changeper.replace('%', ''));
            const bChangeper = parseFloat(b.Changeper.replace('%', ''));
            return bChangeper - aChangeper;
        });

        // Get top 10 gainers and losers
        const topGainers = sortedByChange.slice(0, 10);
        const topLosers = sortedByChange.slice(-10).reverse();

        // Send response
        res.json({
            topGainers,
            topLosers
        });
    });
};
