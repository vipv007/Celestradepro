const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let nifty = new Schema({
    symbol: {
        type: String
    },
    CompanyName: {
        type: String
    },
    industry: {
        type: String
    },
    series: {
        type: String
    },
    ISINCode: {
        type: String
    }
}, {
    collection: 'nifty'
});
module.exports = mongoose.model('nifty', nifty);
//# sourceMappingURL=niftyModel.js.map