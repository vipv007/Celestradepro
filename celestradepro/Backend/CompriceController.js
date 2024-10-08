// controller.js
const { updateData, getCommodityData } = require('./CompriceModel');

// Controller to fetch and update data
async function fetchAndUpdateData(req, res) {
  try {
    await updateData();
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Controller to get commodity data
async function getCommodityDataController(req, res) {
  const { name } = req.params;

  try {
    const data = await getCommodityData(name);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { fetchAndUpdateData, getCommodityDataController };
