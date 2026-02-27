const express = require("express");
const router = express.Router();
const controller = require("../../controllers/hr/messagesController");

router.get("/conversations", controller.getConversations);
router.get("/conversation/:id", controller.getMessages);
router.post("/send", controller.sendMessage);

module.exports = router;
