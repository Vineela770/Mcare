const express = require("express");
const router = express.Router();
const jobsController = require("../controllers/jobsController");

router.get("/", jobsController.getJobs);
router.delete("/:id", jobsController.deleteJob);

module.exports = router;
