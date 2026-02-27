const express = require("express");
const router = express.Router();
const controller = require("../../controllers/hr/messagesController");
const { verifyToken } = require("../../middleware/auth.middleware");

router.use(verifyToken);

router.get("/search", controller.searchCandidates);
router.get("/conversations", controller.getConversations);
router.get("/conversation/:otherUserId", controller.getMessages);
router.post("/send", controller.sendMessage);

module.exports = router;
