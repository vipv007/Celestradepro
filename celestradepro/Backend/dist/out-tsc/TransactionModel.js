const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
    stock: {
        type: String
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    totalAmount: {
        type: Number
    },
    option: {
        type: String
    },
}, {
    collection: 'Transaction'
});
module.exports = mongoose.model('Transaction', transactionSchema);
//# sourceMappingURL=TransactionModel.js.map