const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Com_news = new Schema({
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
    collection: 'com_news'
});
module.exports = mongoose.model('Com_news', Com_news);
//# sourceMappingURL=com_newsModel.js.map