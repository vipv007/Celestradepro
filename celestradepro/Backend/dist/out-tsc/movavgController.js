var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const movingAverageModel = require('./movavgModel');
const getMovingAverages = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const commodity = req.params.commodity;
        console.log(`Fetching data for commodity: ${commodity}`); // Debugging log
        const data = yield movingAverageModel.fetchMovingAverages(commodity);
        if (data.length === 0) {
            console.log('No data found for commodity:', commodity); // Debugging log
            res.status(404).send('Commodity not found');
        }
        else {
            res.json(data);
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
module.exports = {
    getMovingAverages,
};
//# sourceMappingURL=movavgController.js.map