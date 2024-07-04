// Node.js controller code
const stock = require('./stockModel');

exports.getAllStocks = (req, res) => {
  stock.find({}, (err, stocks) => {
    if (err) {
      res.send(err);
    }
    res.json(stocks);
    console.log('Stocks:', stocks);
  });
};

exports.createStock = (req, res) => {
  const newstock = new stock(req.body);
  newstock.save((err, stock) => {
    if (err) {
      res.send(err);
    }
    res.json(stock);
  });
};

exports.getStockBySymbol = (req, res) => {
  const { symbol } = req.params;

  stock.find({ symbol }, (err, stocks) => { // Use .find() to return all matching stocks
    if (err) {
      res.send(err);
    } else if (!stocks || stocks.length === 0) {
      res.status(404).json({ message: "Stocks not found" }); // Pluralize for clarity
    } else {
      res.json(stocks);
    }
  });
};

// Define a new endpoint to fetch selected stocks where selected field is true
exports.getSelectedStocks = (req, res) => {
  stock.find({ selected: true }, (err, selectedStocks) => {
    if (err) {
      res.status(500).json({ message: "Error fetching selected stocks" });
    } else {
      res.json(selectedStocks);
      //console.log('Selected Data:', selectedStocks);
    }
  });
};

exports.addSelectedStock = (req, res) => {
  const { id } = req.body;

  stock.findByIdAndUpdate(id, { selected: true }, { new: true }, (err, updatedStock) => {
    if (err) {
      res.status(500).json({ message: "Error updating stock" });
    } else {
      if (updatedStock && updatedStock.selected) {
        res.json(updatedStock);
      } else {
        res.status(404).json({ message: "Stock not found or not selected" });
      }
    }
  });
};

exports.removeSelectedStock = (req, res) => {
  const { id } = req.body;

  stock.findByIdAndUpdate(id, { selected: false }, { new: true }, (err, updatedStock) => {
    if (err) {
      res.status(500).json({ message: "Error updating stock" });
    } else {
      res.json(updatedStock);
     
    }
  });
};



