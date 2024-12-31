// models/FinancialData.js
const mongoose = require('mongoose');
const financialDataSchema = new mongoose.Schema({
    year: Number,
    company: String,
    profit: Number,
    revenue: Number,
    netWorth: Number
});
module.exports = mongoose.model('FinancialData', financialDataSchema);
//# sourceMappingURL=finrevproModel.js.map