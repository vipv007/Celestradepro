const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Comindex = new Schema({
    Name: {
        type: String
    },
    Last: {
        type: Number
    },
    High: {
        type: Number
    },
    Low: {
        type: Number
    },
    Chg: {
        type: String
    },
    Time: {
        type: Number
    }
}, {
    collection: 'Comindex'
});
module.exports = mongoose.model('Comindex', Comindex);
//# sourceMappingURL=comindexModel.js.map