const pool = require("../../config/db");

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const activeJobs = await pool.query(
      "SELECT COUNT(*) FROM jobs WHERE status='Active'"
    );

    const totalApplications = await pool.query(
      "SELECT COUNT(*) FROM applications"
    );

    const interviewed = await pool.query(
      "SELECT COUNT(*) FROM applications WHERE status='Interview'"
    );

    const hired = await pool.query(
      "SELECT COUNT(*) FROM applications WHERE status='Hired'"
    );

    res.json({
      activeJobs: parseInt(activeJobs.rows[0].count),
      totalApplications: parseInt(totalApplications.rows[0].count),
      interviewed: parseInt(interviewed.rows[0].count),
      hired: parseInt(hired.rows[0].count),
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Recent Applications
exports.getRecentApplications = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM applications ORDER BY applied_date DESC LIMIT 5"
    );

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
