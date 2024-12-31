// Node.js controller code
const Volatility = require('./volatilityModel');
exports.getAllVolatility = (req, res) => {
    Volatility.find({}, (err, volatilitys) => {
        if (err) {
            res.send(err);
        }
        res.json(volatilitys);
    });
};
//# sourceMappingURL=volatilityController.js.map