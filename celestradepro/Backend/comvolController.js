const commodityModel = require('./comvolmodel');

const getAllCommodities = async (req, res) => {
  try {
    const commoditiesData = await commodityModel.fetchAllCommodities();
    res.json(commoditiesData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
};

module.exports = {
  getAllCommodities,
};
