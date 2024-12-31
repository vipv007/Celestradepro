const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let News = new Schema({
    url: {
        type: String
    },
    headline: {
        type: String
    },
    summary: {
        type: String
    },
    sentimentScore: {
        type: Number
    },
    sentiment: {
        type: String
    },
    articleDateTime: {
        type: String
    },
    archive: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'st_news'
});
module.exports = mongoose.model('News', News);
//# sourceMappingURL=newsModel.js.map