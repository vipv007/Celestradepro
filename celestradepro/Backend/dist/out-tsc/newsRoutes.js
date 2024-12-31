const express = require('express');
const router = express.Router();
const newsController = require('./newsController');
router.put('/:id/archive', newsController.archiveNews);
module.exports = router;
//# sourceMappingURL=newsRoutes.js.map