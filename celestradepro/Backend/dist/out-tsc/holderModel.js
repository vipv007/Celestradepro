const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let holder = new Schema({
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
    collection: 'holder'
});
module.exports = mongoose.model('holder', holder);
//# sourceMappingURL=holderModel.js.map