const express = require('express');
const { summarizeUrl } = require('./fxsummariController'); // Import the summarizeUrl function
const router = express.Router();
// Define the route for summarizing a URL
router.post('/summarize-urls', summarizeUrl);
module.exports = router;
//# sourceMappingURL=fnewsRouter.js.map