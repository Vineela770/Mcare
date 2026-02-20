const express = require("express");
const router = express.Router();
const controller = require("../controllers/interviewsController");

router.get("/", controller.getInterviews);
router.post("/", controller.createInterview);
router.put("/:id", controller.updateInterview);

module.exports = router;
