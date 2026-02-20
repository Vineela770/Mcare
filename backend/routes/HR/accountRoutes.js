const express = require("express");
const router = express.Router();
const controller = require("../controllers/accountController");

router.delete("/delete-profile", controller.deleteAccount);
router.post("/send-recovery-mail", controller.sendRecoveryMail);

module.exports = router;
