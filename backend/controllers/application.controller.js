const pool = require("../config/db");
const sendEmail = require("../utils/email.service");

// @desc    Candidate applies for a job
exports.applyToJob = async (req, res) => {
  try {
    const { job_id, resume_url, cover_letter } = req.body;
    const userId = req.user.id; // From verifyToken middleware

    // 1. Prevent double applications
    const existingApp = await pool.query(
      "SELECT * FROM applications WHERE job_id = $1 AND user_id = $2",
      [job_id, userId]
    );

    if (existingApp.rows.length > 0) {
      return res.status(400).json({ message: "You have already applied for this position" });
    }

    // 2. Insert application
    const newApp = await pool.query(
      `INSERT INTO applications (job_id, user_id, resume_url, cover_letter, status) 
       VALUES ($1, $2, $3, $4, 'Pending') RETURNING *`,
      [job_id, userId, resume_url, cover_letter]
    );

    // 3. Send confirmation email (Optional but professional)
    try {
      await sendEmail(
        req.user.email, 
        "Application Received - MCARE Jobs", 
        "Thank you for applying. The employer will review your profile shortly."
      );
    } catch (mailErr) {
      console.warn("⚠️ App saved, but email failed to send.");
    }

    res.status(201).json({ message: "Application submitted successfully", application: newApp.rows[0] });
  } catch (err) {
    console.error("❌ Application Error:", err.message);
    res.status(500).json({ message: "Error submitting application" });
  }
};

// @desc    Get all applications for the logged-in candidate
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT a.id, a.status, a.applied_at, j.title, j.company_name, j.city
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      WHERE a.user_id = $1
      ORDER BY a.applied_at DESC
    `;
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your applications" });
  }
};

// @desc    Get all applications (for HR/Admin)
exports.getAllApplications = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id,
        a.job_id,
        a.user_id,
        a.status,
        a.applied_at,
        a.resume_url,
        a.cover_letter,
        j.title as "jobTitle",
        j.company_name,
        j.city as location,
        u.name as "candidateName",
        u.email,
        u.phone,
        u.experience,
        u.qualification
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      ORDER BY a.applied_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching all applications:", err.message);
    res.status(500).json({ message: "Error fetching applications" });
  }
};

// @desc    Update application status (for HR/Admin)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      "UPDATE applications SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application status updated", application: result.rows[0] });
  } catch (err) {
    console.error("❌ Error updating application status:", err.message);
    res.status(500).json({ message: "Error updating application status" });
  }
};