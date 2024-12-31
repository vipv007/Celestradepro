const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Ratio = new Schema({
    P_B: {
        type: String
    },
    P_E: {
        type: String
    },
    Forward_P_E: {
        type: String
    },
    PEG: {
        type: String
    },
    Debt_Eq: {
        type: String
    },
    EPS_ttm: {
        type: String
    },
    Dividend: {
        type: String
    },
    ROE: {
        type: String
    },
    ROI: {
        type: String
    },
    EPS_Q_Q: {
        type: String
    },
    Insider_Own: {
        type: String
    },
    Symbol: {
        type: String
    },
}, {
    collection: 'ratios'
});
module.exports = mongoose.model('Ratio', Ratio);
//# sourceMappingURL=ratioModel.js.map