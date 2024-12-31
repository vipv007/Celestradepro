const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let insider = new Schema({}, {
    collection: 'Insider'
});
module.exports = mongoose.model('insider', insider);
//# sourceMappingURL=insiderModel.js.map