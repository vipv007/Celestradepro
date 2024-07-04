const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MarketdepthSchema = new Schema({
    high: { type: String },
    low: { type: String },
    price: { type: String }
}, {
    collection: 'marketdepth'
});

module.exports = mongoose.model('Marketdepth', MarketdepthSchema);
