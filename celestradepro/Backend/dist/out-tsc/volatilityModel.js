const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Volatility = new Schema({
    symbol: {
        type: String
    },
    price: {
        type: String
    },
    implied_volatility: {
        type: String
    },
    open_interest: {
        type: String
    },
}, {
    collection: 'option_data'
});
module.exports = mongoose.model('Volatility', Volatility);
//# sourceMappingURL=volatilityModel.js.map