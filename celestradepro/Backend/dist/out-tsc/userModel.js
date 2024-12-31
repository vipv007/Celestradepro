const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// userModel.js
let userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    theme: { type: String, default: 'light' },
    watchlist: { type: Array, default: [] },
    selectedSections: { type: [String], default: [] },
    archivedArticles: [{
            id: String,
            headline: String,
            summary: String,
            sentimentScore: Number,
            sentiment: String,
            articleDateTime: String,
            imageUrl: String
        }], // Array to store selected sections
    archivedArticlesop: [{
            id: String,
            headline: String,
            summary: String,
            sentimentScore: Number,
            sentiment: String,
            articleDateTime: String,
            imageUrl: String
        }],
    archivedArticlescom: [{
            id: String,
            headline: String,
            summary: String,
            sentimentScore: Number,
            sentiment: String,
            articleDateTime: String,
            imageUrl: String
        }],
    archivedArticlesfox: [{
            id: String,
            headline: String,
            summary: String,
            sentimentScore: Number,
            sentiment: String,
            articleDateTime: String,
            imageUrl: String
        }]
}, {
    collection: 'Users',
});
module.exports = mongoose.model('User', userSchema);
//# sourceMappingURL=userModel.js.map