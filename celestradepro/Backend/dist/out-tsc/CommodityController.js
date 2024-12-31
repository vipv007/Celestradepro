// Node.js controller code
const commodity = require('./CommodityModel');
exports.getCommodity = (req, res) => {
    commodity.find({}, (err, commodity) => {
        if (err) {
            res.send(err);
        }
        res.json(commodity);
    });
};
exports.getDataBySymbol = (req, res) => {
    const { Commodity } = req.params;
    commodity.find({ Commodity }, (err, commoditys) => {
        if (err) {
            res.send(err);
        }
        else if (!commoditys || commoditys.length === 0) {
            res.status(404).json({ message: "Datas not found" }); // Pluralize for clarity
        }
        else {
            res.json(commoditys);
        }
    });
};
exports.getSelectedComs = (req, res) => {
    commodity.find({ selected: true }, (err, selectedDatas) => {
        if (err) {
            res.status(500).json({ message: "Error fetching selected stocks" });
        }
        else {
            res.json(selectedDatas);
            console.log('Selected Data:', selectedDatas);
        }
    });
};
exports.addSelectedCom = (req, res) => {
    const { id } = req.body;
    commodity.findByIdAndUpdate(id, { selected: true }, { new: true }, (err, updatedCommodity) => {
        if (err) {
            res.status(500).json({ message: "Error updating commodity" });
        }
        else {
            if (updatedCommodity && updatedCommodity.selected) {
                res.json(updatedCommodity);
            }
            else {
                res.status(404).json({ message: "Commodity not found or not selected" });
            }
        }
    });
};
exports.removeSelectedCom = (req, res) => {
    const { id } = req.body;
    commodity.findByIdAndUpdate(id, { selected: false }, { new: true }, (err, updatedCommodity) => {
        if (err) {
            res.status(500).json({ message: "Error updating commodity" });
        }
        else {
            res.json(updatedCommodity);
        }
    });
};
//# sourceMappingURL=CommodityController.js.map