const express = require("express");
const router = express.Router();
const {
  getReportStats,
  generateUserReport
} = require("../../controllers/admin/reportsController");

router.get("/stats", getReportStats);
router.post("/generate-user", generateUserReport);

module.exports = router;
