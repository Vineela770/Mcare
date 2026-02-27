const express = require("express");
const router = express.Router();
const controller = require("../../controllers/message.controller");
const { verifyToken } = require("../../middleware/auth.middleware");

router.use(verifyToken);

router.get("/search", controller.searchContacts);
router.get("/conversations", controller.getConversations);
router.get("/history/:otherUserId", controller.getChatHistory);
router.post("/send", controller.sendMessage);

module.exports = router;
