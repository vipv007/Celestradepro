const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GainersSchema = new Schema({
    symbol: { type: String },
    name: { type: String },
    change: { type: String },
    changePercentage: { type: Number },
    price: { type: Number },
    type: { type: String },
}, {
    collection: 'Gainers_Losers'
});

module.exports = mongoose.model('Gainers', GainersSchema);
