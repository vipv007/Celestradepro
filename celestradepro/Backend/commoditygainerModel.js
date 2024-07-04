const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CgainerSchema = new Schema({
    Name: { type: String },
    Company: { type: String },
    Changeper: { type: String },
    Change: { type: Number },
    Liveprices: { type: String },
    Lastprice: { type: Number },
    Type: { type: String },
}, {
    collection: 'Comgainers'
});

module.exports = mongoose.model('Cgainer', CgainerSchema);
