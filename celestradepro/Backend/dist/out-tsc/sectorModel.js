const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let sector = new Schema({
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
    collection: 'sector'
});
module.exports = mongoose.model('sector', sector);
//# sourceMappingURL=sectorModel.js.map