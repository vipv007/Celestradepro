// Node.js controller code
const Forex = require('./forexModel');
exports.getAllForexs = (req, res) => {
    Forex.find({}, (err, forexs) => {
        if (err) {
            res.send(err);
        }
        res.json(forexs);
    });
};
exports.createForex = (req, res) => {
    const newForex = new Forex(req.body);
    newForex.save((err, forex) => {
        if (err) {
            res.send(err);
        }
        res.json(forex);
    });
};
exports.getDataBySymbol = (req, res) => {
    const { symbol } = req.params;
    Forex.find({ symbol }, (err, forexs) => {
        if (err) {
            res.status(500).send(err);
        }
        else if (!forexs || forexs.length === 0) {
            res.status(404).json({ message: "Forex data not found" }); // Pluralize for clarity
        }
        else {
            res.json(forexs);
        }
    });
};
exports.getSelectedForexs = (req, res) => {
    Forex.find({ selected: true }, (err, selectedForexs) => {
        if (err) {
            res.status(500).json({ message: "Error fetching selected forexs" });
        }
        else {
            res.json(selectedForexs);
            //console.log('Selected Data:', selectedForexs);
        }
    });
};
exports.addSelectedForex = (req, res) => {
    const { id } = req.body;
    Forex.findByIdAndUpdate(id, { selected: true }, { new: true }, (err, updatedForex) => {
        if (err) {
            res.status(500).json({ message: "Error updating forex" });
        }
        else {
            if (updatedForex && updatedForex.selected) {
                res.json(updatedForex);
                //console.log('Forex Data:',updatedForex)
            }
            else {
                res.status(404).json({ message: "Forex not found or not selected" });
            }
        }
    });
};
exports.removeSelectedForex = (req, res) => {
    const { id } = req.body;
    Forex.findByIdAndUpdate(id, { selected: false }, { new: true }, (err, updatedForex) => {
        if (err) {
            res.status(500).json({ message: "Error updating forex" });
        }
        else {
            res.json(updatedForex);
        }
    });
};
//# sourceMappingURL=forexController.js.map