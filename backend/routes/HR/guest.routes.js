const express = require("express");
const router = express.Router();
const guestController = require("../../controllers/guest.controller");
const multer = require("multer");
const path = require("path");

// Configure multer for resume uploads
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
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
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

// Guest public routes (no authentication required)
router.post("/quick-apply", upload.single("resume"), guestController.quickApply);
router.post("/quick-post-job", guestController.quickPostJob);

// Admin routes to view and manage guest submissions
router.get("/applications", guestController.getGuestApplications);
router.get("/jobs", guestController.getGuestJobs);
router.put("/applications/:id/status", guestController.updateGuestApplicationStatus);
router.put("/jobs/:id/status", guestController.updateGuestJobStatus);

module.exports = router;
