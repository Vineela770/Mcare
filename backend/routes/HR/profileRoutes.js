const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/hr/profileController");

router.get("/", profileController.getProfile);
router.post("/", profileController.saveProfile);

module.exports = router;
