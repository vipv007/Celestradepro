const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Profile = new Schema({
    country: {
        type: String
    },
    currency: {
        type: String
    },
    exchange: {
        type: String
    },
    finnhubIndustry: {
        type: String
    },
    logo: {
        type: String
    },
    marketCapitalization: {
        type: String
    },
    name: {
        type: String
    },
    weburl: {
        type: String
    },
    shareOutstanding: {
        type: String
    },
    ticker: {
        type: String
    },
    ipo: {
        type: Date
    }
}, {
    collection: 'profiles'
});
module.exports = mongoose.model('Profile', Profile);
//# sourceMappingURL=profileModel.js.map