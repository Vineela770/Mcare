const express = require("express");
const router = express.Router();
const applicationsController = require("../../controllers/admin/applicationsController");

// GET /api/admin/applications        — all applications
router.get("/", applicationsController.getAllApplications);

// GET /api/admin/applications/stats  — status breakdown counts
router.get("/stats", applicationsController.getApplicationStats);

// GET /api/admin/applications/user/:userId — applications for one user
router.get("/user/:userId", applicationsController.getUserApplications);

module.exports = router;
