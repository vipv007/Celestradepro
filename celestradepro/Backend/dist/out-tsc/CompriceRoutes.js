const express = require('express');
const router = express.Router();
const { updateData, getData } = require('../commodityController');
router.get('/update-data', updateData);
router.get('/get-data', getData);
module.exports = router;
//# sourceMappingURL=CompriceRoutes.js.map