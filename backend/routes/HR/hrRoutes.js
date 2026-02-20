const express = require("express");
const router = express.Router();
const controller = require("../controllers/hrController");

router.put("/change-password", controller.changePassword);

module.exports = router;
