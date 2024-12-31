const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Optionnews = new Schema({
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
    imageUrl: String,
    archive: {
        type: Boolean,
        default: false
    }
}, {
    collection: 'op_news'
});
module.exports = mongoose.model('Optionnews', Optionnews);
//# sourceMappingURL=optionnewsModel.js.map