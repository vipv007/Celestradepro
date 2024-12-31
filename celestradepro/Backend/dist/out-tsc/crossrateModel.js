const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Crossrate = new Schema({
    USD_USD: {
        type: String
    },
    USD_EUR: {
        type: String
    },
    USD_JPY: {
        type: String
    },
    USD_GBP: {
        type: String
    },
    USD_CHF: {
        type: String
    },
    USD_AUD: {
        type: String
    },
    USD_CAD: {
        type: String
    },
    USD_NZD: {
        type: String
    },
    EUR_USD: {
        type: String
    },
    EUR_EUR: {
        type: String
    },
    EUR_JPY: {
        type: String
    },
    EUR_GBP: {
        type: String
    },
    EUR_CHF: {
        type: String
    },
    EUR_AUD: {
        type: String
    },
    EUR_CAD: {
        type: String
    },
    EUR_NZD: {
        type: String
    },
    JPY_USD: {
        type: String
    },
    JPY_EUR: {
        type: String
    },
    JPY_JPY: {
        type: String
    },
    JPY_GBP: {
        type: String
    },
    JPY_CHF: {
        type: String
    },
    JPY_AUD: {
        type: String
    },
    JPY_CAD: {
        type: String
    },
    JPY_NZD: {
        type: String
    },
    GBP_USD: {
        type: String
    },
    GBP_EUR: {
        type: String
    },
    GBP_JPY: {
        type: String
    },
    GBP_GBP: {
        type: String
    },
    GBP_CHF: {
        type: String
    },
    GBP_AUD: {
        type: String
    },
    GBP_CAD: {
        type: String
    },
    GBP_NZD: {
        type: String
    },
    CHF_USD: {
        type: String
    },
    CHF_EUR: {
        type: String
    },
    CHF_JPY: {
        type: String
    },
    CHF_GBP: {
        type: String
    },
    CHF_CHF: {
        type: String
    },
    CHF_AUD: {
        type: String
    },
    CHF_CAD: {
        type: String
    },
    CHF_NZD: {
        type: String
    },
    AUD_USD: {
        type: String
    },
    AUD_EUR: {
        type: String
    },
    AUD_JPY: {
        type: String
    },
    AUD_GBP: {
        type: String
    },
    AUD_CHF: {
        type: String
    },
    AUD_AUD: {
        type: String
    },
    AUD_CAD: {
        type: String
    },
    AUD_NZD: {
        type: String
    },
    CAD_USD: {
        type: String
    },
    CAD_EUR: {
        type: String
    },
    CAD_JPY: {
        type: String
    },
    CAD_GBP: {
        type: String
    },
    CAD_CHF: {
        type: String
    },
    CAD_AUD: {
        type: String
    },
    CAD_CAD: {
        type: String
    },
    CAD_NZD: {
        type: String
    },
    NZD_USD: {
        type: String
    },
    NZD_EUR: {
        type: String
    },
    NZD_JPY: {
        type: String
    },
    NZD_GBP: {
        type: String
    },
    NZD_CHF: {
        type: String
    },
    NZD_AUD: {
        type: String
    },
    NZD_CAD: {
        type: String
    },
    NZD_NZD: {
        type: String
    },
}, {
    collection: 'crossrate'
});
module.exports = mongoose.model('Crossrate', Crossrate);
//# sourceMappingURL=crossrateModel.js.map