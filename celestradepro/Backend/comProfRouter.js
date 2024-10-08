const express = require('express');
const router = express.Router();
const comProfController = require('./comProfController');

router.get('/', comProfController.getAllCompanyProfiles);

module.exports = router;
