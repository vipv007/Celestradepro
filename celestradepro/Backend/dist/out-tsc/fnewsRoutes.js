const express = require('express');
const router = express.Router();
const fnewsController = require('./fnewsController');
router.put('/:id/archive', fnewsController.archiveNews);
module.exports = router;
//# sourceMappingURL=fnewsRoutes.js.map