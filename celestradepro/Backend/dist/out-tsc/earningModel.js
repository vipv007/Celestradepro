const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Earning = new Schema({
    symbol: {
        type: String
    },
    actual: {
        type: String
    },
    estimate: {
        type: String
    },
    surprise: {
        type: String
    },
    surprisePercent: {
        type: String
    },
}, {
    collection: 'Earnings'
});
module.exports = mongoose.model('Earning', Earning);
//# sourceMappingURL=earningModel.js.map