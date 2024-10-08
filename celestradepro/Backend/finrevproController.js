// controllers/financialDataController.js
const FinancialData = require('./finrevproModel');

// Get all financial data
exports.getAllFinancialData = async (req, res) => {
    try {
        const data = await FinancialData.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};