const express = require('express');
const router = express.Router();
const optionnewsController = require('./optionnewsController');
router.get('/', optionnewsController.getOptionnews);
router.put('/:id/archive', optionnewsController.archiveOptionnews);
router.put('/:id/restore', optionnewsController.restoreOptionnews);
module.exports = router;
//# sourceMappingURL=optionnewsRoutes.js.map