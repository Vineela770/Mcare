const express = require("express");
const router = express.Router();
const applicationController = require("../../controllers/application.controller");
const { verifyToken } = require("../../middleware/auth.middleware");

// Protected routes - require authentication
router.post("/apply", verifyToken, applicationController.applyToJob);
router.get("/my-applications", verifyToken, applicationController.getMyApplications);

// Admin/HR routes - get all applications and update status
router.get("/", applicationController.getAllApplications);
router.put("/:id/status", applicationController.updateApplicationStatus);

module.exports = router;
