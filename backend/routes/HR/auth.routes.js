const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const { verifyToken } = require("../../middleware/auth.middleware");
const multer = require("multer");
const path = require("path");

// Configure multer for resume uploads during registration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, and DOCX files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

// Public routes
router.post("/register", upload.single("resume"), authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/google-login", authController.googleLogin);

// Protected routes (require authentication)
router.post("/change-password", verifyToken, authController.changePassword);
router.delete("/delete-profile", verifyToken, authController.deleteProfile);
router.post("/send-recovery-mail", verifyToken, authController.sendRecoveryMail);

module.exports = router;
