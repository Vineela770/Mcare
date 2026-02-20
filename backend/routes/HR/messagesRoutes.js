const express = require("express");
const router = express.Router();
const controller = require("../controllers/messagesController");

router.get("/conversations", controller.getConversations);
router.get("/conversation/:id", controller.getMessages);
router.post("/send", controller.sendMessage);

module.exports = router;
