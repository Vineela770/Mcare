const express = require("express");
const router = express.Router();
const supportController = require("../../controllers/support.controller");

// POST /api/support/contact - Submit contact form
router.post("/contact", supportController.submitContact);

// GET /api/support/faqs - Get all FAQs
router.get("/faqs", supportController.getFAQs);

module.exports = router;
