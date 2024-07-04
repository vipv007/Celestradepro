const Marketdepth = require('./marketdepthModel');

exports.getAllMarketDepth = (req, res) => {
    Marketdepth.find({}, (err, marketdepth) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(marketdepth);
        }
    });
};
