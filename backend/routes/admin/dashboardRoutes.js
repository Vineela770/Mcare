const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/dashboardController");

// Frontend calls GET /api/admin/dashboard — handle both root and /stats
router.get("/", dashboardController.getDashboardStats);
router.get("/stats", dashboardController.getDashboardStats);

module.exports = router;
