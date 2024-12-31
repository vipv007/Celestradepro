const express = require('express');
const { summarizeUrl } = require('./summarizerController'); // Import the summarizeUrl function
const router = express.Router();
// Define the route for summarizing a URL
router.post('/summarize-url', summarizeUrl);
module.exports = router;
//# sourceMappingURL=newsRouter.js.map