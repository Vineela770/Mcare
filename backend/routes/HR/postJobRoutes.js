const express = require("express");
const router = express.Router();
const postJobController = require("../controllers/postJobController");

router.post("/", postJobController.createJob);

module.exports = router;
