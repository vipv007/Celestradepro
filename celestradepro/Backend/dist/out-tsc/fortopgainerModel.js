const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let GainerSchema = new Schema({
    Name: { type: String },
    Instrument: { type: String },
    Changeper: { type: String },
    Change: { type: Number },
    Liveprices: { type: Number },
    Lastprice: { type: Number },
    Type: { type: String },
}, {
    collection: 'gainers'
});
module.exports = mongoose.model('Gainer', GainerSchema);
//# sourceMappingURL=fortopgainerModel.js.map