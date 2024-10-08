const Comprof = require('./comProfModel');

exports.getAllCompanyProfiles = async (req, res) => {
  try {
    const profiles = await Comprof.find({});
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching company profiles:', error);
    res.status(500).send('Internal Server Error');
  }
};
