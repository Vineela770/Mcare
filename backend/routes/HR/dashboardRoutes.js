const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/hr/dashboardController");

// Dashboard APIs
router.get("/stats", dashboardController.getDashboardStats);
router.get("/recent-applications", dashboardController.getRecentApplications);
router.get("/weekly-stats", dashboardController.getWeeklyStats);

module.exports = router;
