// Node.js controller code
const Portfolio = require('./PortfolioModel');

exports.getAllPortfolio= (req, res) => {
  Portfolio.find({}, (err, portfolio) => {
    if (err) {
      res.send(err);
    }
    res.json(portfolio);
  });
};

exports.createPortfolio = (req, res) => {
  const newPortfolio = new Portfolio(req.body); 
  newPortfolio.save((err, portfolio) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).json(portfolio);
    }
  });
};  

exports.updateOrderType = (req, res) => {
  const orderId = req.params.id;
  const updatedOrderType = req.body.order;

  Portfolio.findByIdAndUpdate(orderId, { order: updatedOrderType }, { new: true }, (err, updatedPortfolio) => {
    if (err) {
      console.error('Error updating order type:', err);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.json(updatedPortfolio);
    }
  });
};