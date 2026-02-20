const express = require("express");
const router = express.Router();
const statsController = require("../../controllers/stats.controller");

// Public route - get homepage statistics
router.get("/impact", statsController.getImpactStats);

module.exports = router;
