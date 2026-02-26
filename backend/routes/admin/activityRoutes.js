const express = require("express");
const router = express.Router();
const activityController = require("../../controllers/admin/activitycontroller");

router.get("/", activityController.getActivities);
router.get("/stats", activityController.getStats);

module.exports = router;
