const Gainers = require('./StockGainerModel');
exports.getAllGainersAndLosers = (req, res) => {
    Gainers.find({}, (err, Gainers) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.json(Gainers);
        }
    });
};
exports.getGainersAndLosers = (req, res) => {
    Gainers.find({}, (err, Gainers) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            const gainers = Gainers.filter(item => item.type === 'gainer');
            const losers = Gainers.filter(item => item.type === 'loser');
            const sortedByChange = gainers.sort((a, b) => b.change - a.change);
            const sortedByChangePercentage = gainers.sort((a, b) => b.changesPercentage - a.changesPercentage);
            const sortedLosersByChange = losers.sort((a, b) => a.change - b.change);
            const sortedLosersByChangePercentage = losers.sort((a, b) => a.changesPercentage - b.changesPercentage);
            // Get top 10 gainers and losers
            const topGainers = sortedByChange.slice(0, 10);
            const topLosers = sortedLosersByChange.slice(0, 10);
            // Send response
            res.json({
                topGainers: topGainers,
                topLosers: topLosers
            });
        }
    });
};
//# sourceMappingURL=StockGainerController.js.map