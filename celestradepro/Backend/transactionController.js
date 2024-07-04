
const Transaction = require('./TransactionModel');

exports.createTransaction = async (req, res) => {
    try {
        const { stock, quantity, price, totalAmount, option } = req.body;
        const newTransaction = new Transaction({ stock, quantity, price, totalAmount, option });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
