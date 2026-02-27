const express = require("express");
const router = express.Router();
const candidateController = require("../../controllers/candidate.controller");
const { verifyToken } = require("../../middleware/auth.middleware");

// All routes require authentication
router.use(verifyToken);

// Dashboard
router.get("/dashboard", candidateController.getDashboardStats);

// Jobs
router.get("/jobs", candidateController.getAllJobs);
router.get("/jobs/:id", candidateController.getJobById);
router.post("/jobs/apply", candidateController.applyToJob);

// Applications
router.get("/applications", candidateController.getMyApplications);
router.get("/applications/:id", candidateController.getApplicationDetails);

// Resume/Profile
router.get("/resume", candidateController.getUserResumeData);
router.put("/resume", candidateController.updateResumeData);
router.post("/upload-resume", candidateController.uploadCV.single("resume"), (req, res) => {
  res.json({ success: true, resumeUrl: `/uploads/resumes/${req.file.filename}` });
});
router.post("/upload-photo", candidateController.uploadPhoto.single("photo"), (req, res) => {
  res.json({ success: true, photoUrl: `/uploads/profile_photos/${req.file.filename}` });
});

// Saved Jobs
router.post("/saved-jobs", candidateController.saveJob);
router.get("/saved-jobs", candidateController.getSavedJobs);
router.delete("/saved-jobs/:id", candidateController.deleteSavedJob);

// Job Alerts
router.post("/alerts", candidateController.createAlert);
router.get("/alerts", candidateController.getAlerts);
router.put("/alerts/:id", candidateController.updateAlert);
router.put("/alerts/:id/toggle", candidateController.toggleAlert);
router.delete("/alerts/:id", candidateController.deleteAlert);

// Search
router.get("/search/hospitals", candidateController.searchHospitals);

module.exports = router;
