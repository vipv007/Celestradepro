const movingAverageModel = require('./movavgModel');

const getMovingAverages = async (req, res) => {
  try {
    const commodity = req.params.commodity;
    console.log(`Fetching data for commodity: ${commodity}`); // Debugging log
    const data = await movingAverageModel.fetchMovingAverages(commodity);
    if (data.length === 0) {
      console.log('No data found for commodity:', commodity); // Debugging log
      res.status(404).send('Commodity not found');
    } else {
      res.json(data);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  getMovingAverages,
};
