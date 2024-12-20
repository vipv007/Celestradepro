const express = require('express');
const router = express.Router();

// Additional API routes (e.g., some custom routes for other functionalities)
router.get('/custom-route', (req, res) => {
    res.json({ message: 'This is a custom route in api.js' });
});

module.exports = router;  // Export the routes to be used in server.js
