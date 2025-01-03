const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    watchlist: { type: Array, default: [] },
    theme: { type: String, default: 'light' },
    selectedSections: { type: Array, default: [] },
    archivedArticles: { type: Array, default: [] },
    archivedOptionArticles: { type: Array, default: [] },
    archivedCommodityArticles: { type: Array, default: [] },
    archivedForexArticles: { type: Array, default: [] }
});
// Check if the model already exists before defining it
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map