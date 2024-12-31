var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Transaction = require('./TransactionModel');
exports.createTransaction = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { stock, quantity, price, totalAmount, option } = req.body;
        const newTransaction = new Transaction({ stock, quantity, price, totalAmount, option });
        yield newTransaction.save();
        res.status(201).json(newTransaction);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
//# sourceMappingURL=transactionController.js.map