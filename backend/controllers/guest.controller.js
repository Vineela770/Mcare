const pool = require("../config/db");
const sendEmail = require("../utils/email.service");
const multer = require("multer");
const path = require("path");

// @desc    Guest quick apply (no registration required)
exports.quickApply = async (req, res) => {
  try {
    const { name, email, phone, countryCode, coverLetter } = req.body;
    const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : null;

    // Validate required fields
    if (!name || !email || !phone || !coverLetter || !resumeUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert guest application
    const result = await pool.query(
      `INSERT INTO guest_applications (name, email, phone, country_code, cover_letter, resume_url, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, 'Pending', NOW()) RETURNING *`,
      [name, email, phone, countryCode || '+91', coverLetter, resumeUrl]
    );

    // Send confirmation email
    try {
      await sendEmail(
        email,
        "Application Received - MCARE Jobs",
        `Dear ${name},\n\nThank you for your quick application. We have received your details and resume. Our team will review your profile and get back to you shortly.\n\nBest regards,\nMCARE Jobs Team`
      );
    } catch (mailErr) {
      console.warn("⚠️ Application saved, but email failed to send.");
    }

    res.status(201).json({
      message: "Quick application submitted successfully!",
      application: result.rows[0]
    });
  } catch (err) {
    console.error("❌ Quick Apply Error:", err.message);
    res.status(500).json({ message: "Error submitting application" });
  }
};

// @desc    Guest quick post job (no registration required)
exports.quickPostJob = async (req, res) => {
  try {
    const { companyName, email, phone, countryCode, jobTitle, location, jobDescription } = req.body;

    // Validate required fields
    if (!companyName || !email || !phone || !jobTitle || !location || !jobDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert guest job post
    const result = await pool.query(
      `INSERT INTO guest_jobs (company_name, email, phone, country_code, job_title, location, job_description, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pending Review', NOW()) RETURNING *`,
      [companyName, email, phone, countryCode || '+91', jobTitle, location, jobDescription]
    );

    // Send confirmation email
    try {
      await sendEmail(
        email,
        "Job Posted Successfully - MCARE Jobs",
        `Dear ${companyName},\n\nThank you for posting "${jobTitle}" on MCARE Jobs! Your job posting is currently under review. Once approved, it will be visible to candidates.\n\nWe will notify you once your job post goes live.\n\nBest regards,\nMCARE Jobs Team`
      );
    } catch (mailErr) {
      console.warn("⚠️ Job posted, but email failed to send.");
    }

    res.status(201).json({
      message: "Job posted successfully! It will be reviewed and published shortly.",
      job: result.rows[0]
    });
  } catch (err) {
    console.error("❌ Quick Post Job Error:", err.message);
    res.status(500).json({ message: "Error posting job" });
  }
};

// @desc    Get all guest applications (for admin)
exports.getGuestApplications = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM guest_applications ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching guest applications:", err.message);
    res.status(500).json({ message: "Error fetching guest applications" });
  }
};

// @desc    Get all guest job posts (for admin)
exports.getGuestJobs = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM guest_jobs ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching guest jobs:", err.message);
    res.status(500).json({ message: "Error fetching guest jobs" });
  }
};

// @desc    Update guest application status
exports.updateGuestApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE guest_applications SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Status updated successfully", application: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating guest application status:", err.message);
    res.status(500).json({ message: "Error updating status" });
  }
};

// @desc    Update guest job status
exports.updateGuestJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE guest_jobs SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Status updated successfully", job: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating guest job status:", err.message);
    res.status(500).json({ message: "Error updating status" });
  }
};
