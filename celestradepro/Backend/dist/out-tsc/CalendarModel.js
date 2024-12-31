const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Calendar = new Schema({
    calendarId: {
        type: String
    },
    date: {
        type: String
    },
    country: {
        type: String
    },
    category: {
        type: String
    },
    event: {
        type: String
    },
    reference: {
        type: String
    },
    referenceDate: {
        type: String
    },
    source: {
        type: String
    },
    sourceURL: {
        type: String
    },
    previous: {
        type: String
    },
    url: {
        type: String
    },
    dateSpan: {
        type: String
    },
    importance: {
        type: String
    },
    lastUpdate: {
        type: String
    },
    unit: {
        type: String
    },
    ticker: {
        type: String
    },
    symbol: {
        type: String
    },
}, {
    collection: 'Calendar'
});
module.exports = mongoose.model('Calendar', Calendar);
//# sourceMappingURL=CalendarModel.js.map