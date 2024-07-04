const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let EventSchema = new Schema({
    date: { type: Date },
    country: { type: String },
    event: { type: String },
    currency: { type: String },
    previous: { type: Number },
    estimate: { type: Number },
    actual: { type: Number },
    change: { type: Number },
    impact: { type: String },
    changePercentage: { type: Number },
    unit: { type: String }
}, {
    collection: 'events'
});

module.exports = mongoose.model('Event', EventSchema);
