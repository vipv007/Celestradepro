var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const commodityModel = require('./comvolmodel');
const getAllCommodities = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const commoditiesData = yield commodityModel.fetchAllCommodities();
        res.json(commoditiesData);
    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});
module.exports = {
    getAllCommodities,
};
//# sourceMappingURL=comvolController.js.map