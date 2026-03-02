const pool = require("../../config/db");

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // HR jobs are stored in mcare_job_posts with status column
    const activeJobs = await pool.query(
      "SELECT COUNT(*) FROM mcare_job_posts WHERE status = 'active'"
    );

    // Total applications linked to HR job posts
    const totalApplications = await pool.query(
      "SELECT COUNT(*) FROM applications WHERE job_id IN (SELECT id FROM mcare_job_posts)"
    );

    const interviewed = await pool.query(
      "SELECT COUNT(*) FROM applications WHERE status = 'Interview' AND job_id IN (SELECT id FROM mcare_job_posts)"
    );

    const hired = await pool.query(
      "SELECT COUNT(*) FROM applications WHERE status = 'Hired' AND job_id IN (SELECT id FROM mcare_job_posts)"
    );

    res.json({
      activeJobs: parseInt(activeJobs.rows[0].count),
      totalApplications: parseInt(totalApplications.rows[0].count),
      interviewed: parseInt(interviewed.rows[0].count),
      hired: parseInt(hired.rows[0].count),
    });

  } catch (error) {
    console.error('❌ getDashboardStats Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get Recent Applications
exports.getRecentApplications = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM applications ORDER BY applied_at DESC LIMIT 5"
    );

    res.json(result.rows);

  } catch (error) {
    console.error('❌ getRecentApplications Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Get This Week Statistics
exports.getWeeklyStats = async (req, res) => {
  try {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    const weekStartISO = weekStart.toISOString();

    const newApps = await pool.query(
      "SELECT COUNT(*) FROM applications WHERE applied_at >= $1 AND job_id IN (SELECT id FROM mcare_job_posts)",
      [weekStartISO]
    );
    const shortlisted = await pool.query(
      "SELECT COUNT(*) FROM applications WHERE status = 'Shortlisted' AND applied_at >= $1 AND job_id IN (SELECT id FROM mcare_job_posts)",
      [weekStartISO]
    );
    const interviews = await pool.query(
      "SELECT COUNT(*) FROM applications WHERE status = 'Interview' AND applied_at >= $1 AND job_id IN (SELECT id FROM mcare_job_posts)",
      [weekStartISO]
    );
    const rejected = await pool.query(
      "SELECT COUNT(*) FROM applications WHERE status = 'Rejected' AND applied_at >= $1 AND job_id IN (SELECT id FROM mcare_job_posts)",
      [weekStartISO]
    );

    res.json({
      newApplications: parseInt(newApps.rows[0].count),
      shortlisted: parseInt(shortlisted.rows[0].count),
      interviews: parseInt(interviews.rows[0].count),
      rejected: parseInt(rejected.rows[0].count),
    });
  } catch (error) {
    console.error('❌ getWeeklyStats Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};
