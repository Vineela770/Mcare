const express = require("express");
const router = express.Router();
const applicationsController = require("../../controllers/hr/applicationsController");

router.get("/", applicationsController.getApplications);
router.put("/:id", applicationsController.updateStatus);

module.exports = router;
