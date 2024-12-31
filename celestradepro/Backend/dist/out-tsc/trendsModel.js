const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Tab = new Schema({
    symbol: {
        type: String
    },
    sell: {
        type: String
    },
    buy: {
        type: String
    },
    hold: {
        type: String
    },
    strong_sell: {
        type: String
    },
    strong_buy: {
        type: String
    }
}, {
    collection: 'trends'
});
module.exports = mongoose.model('Tab', Tab);
//# sourceMappingURL=trendsModel.js.map