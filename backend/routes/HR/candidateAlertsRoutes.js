const express = require("express");
const router = express.Router();
const controller = require("../controllers/candidateAlertsController");

router.get("/", controller.getCandidateAlerts);

module.exports = router;
