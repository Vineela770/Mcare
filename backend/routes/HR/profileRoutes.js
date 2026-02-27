const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/hr/profileController");
const { verifyToken } = require("../../middleware/auth.middleware");

router.use(verifyToken);

router.get("/", profileController.getProfile);
router.post("/", profileController.saveProfile);

module.exports = router;
