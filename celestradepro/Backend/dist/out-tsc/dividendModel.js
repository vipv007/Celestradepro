const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let dividend = new Schema({
    symbol: {
        type: String
    },
    exdate: {
        type: String
    },
    pershare: {
        type: String
    },
    growth: {
        type: String
    },
    payout: {
        type: String
    },
    yield: {
        type: String
    }
}, {
    collection: 'dividend'
});
module.exports = mongoose.model('dividend', dividend);
//# sourceMappingURL=dividendModel.js.map