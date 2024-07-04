// const express = require('express');
// const router = express.Router();
// const com_newsController = require('./com_newsController');

// router.put('/:id/archive', com_newsController.archiveNews);

// module.exports = router;
// com_newsRoutes.js
const express = require('express');
const router = express.Router();
const com_newsController = require('./com_newsController');

router.get('/', com_newsController.getCom_news);
router.put('/:id/archive', com_newsController.archiveCom_news);
router.put('/:id/restore', com_newsController.restoreCom_news);

module.exports = router;
