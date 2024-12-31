const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Interest = new Schema({
    Country: {
        type: String
    },
    CurrentIntrestRate: {
        type: String
    },
    Previous: {
        type: String
    },
    LastChange: {
        type: String
    },
}, {
    collection: 'interest_rates'
});
module.exports = mongoose.model('Interest', Interest);
//# sourceMappingURL=interestModel.js.map