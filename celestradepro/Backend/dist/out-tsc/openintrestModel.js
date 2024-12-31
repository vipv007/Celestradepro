const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let openintrest = new Schema({
    strike: {
        type: String
    },
    openInterest: {
        type: String
    }, type: {
        type: String
    },
}, {
    collection: 'openintrest'
});
module.exports = mongoose.model('openintrest', openintrest);
//# sourceMappingURL=openintrestModel.js.map