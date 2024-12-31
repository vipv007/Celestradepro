var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// controller.js
const { updateData, getCommodityData } = require('./CompriceModel');
// Controller to fetch and update data
function fetchAndUpdateData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield updateData();
            res.json({ message: 'Data updated successfully' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
// Controller to get commodity data
function getCommodityDataController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = req.params;
        try {
            const data = yield getCommodityData(name);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    });
}
module.exports = { fetchAndUpdateData, getCommodityDataController };
//# sourceMappingURL=CompriceController.js.map