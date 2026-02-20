const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

// Dashboard APIs
router.get("/stats", dashboardController.getDashboardStats);
router.get("/recent-applications", dashboardController.getRecentApplications);

module.exports = router;
