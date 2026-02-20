const express = require("express");
const router = express.Router();
const controller = require("../controllers/packagesController");

router.get("/", controller.getPackages);

module.exports = router;
