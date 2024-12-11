const express = require('express');
const router = express.Router();
const User = require('./models/User'); // Correctly import the User model

// Endpoint to store email
router.post('/store-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = new User({ email });
    await user.save();
    res.status(200).json({ message: 'Email stored successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to store email' });
  }
});

// Endpoint to get user theme
router.get('/user-theme/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    res.status(200).json({ theme: user.theme });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch theme' });
  }
});

// Endpoint to update user theme
router.post('/update-user-theme', async (req, res) => {
  try {
    const { email, theme } = req.body;
    await User.updateOne({ email }, { theme });
    res.status(200).json({ message: 'Theme updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update theme' });
  }
});

// Endpoint to get user data
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user data' });
  }
});

// Endpoint to update selected sections for the user
router.post('/update-selected-sections', async (req, res) => {
  try {
    const { email, selectedSections } = req.body;
    await User.updateOne({ email }, { selectedSections });
    res.status(200).json({ message: 'Selected sections updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update selected sections' });
  }
});

module.exports = router;
