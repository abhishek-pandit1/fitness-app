const router = require("express").Router();
const apiRoutes = require("./api");

// Use API routes
router.use(apiRoutes);

module.exports = router;
