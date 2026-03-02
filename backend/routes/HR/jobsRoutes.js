const express = require("express");
const router = express.Router();
const jobsController = require("../../controllers/hr/jobsController");
const postJobController = require("../../controllers/hr/postJobController");

router.get("/", jobsController.getJobs);
router.post("/", postJobController.createJob);
router.get("/:id", jobsController.getJobById);
router.put("/:id", jobsController.updateJob);
router.delete("/:id", jobsController.deleteJob);

module.exports = router;
