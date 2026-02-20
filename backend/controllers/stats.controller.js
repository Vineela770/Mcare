const pool = require("../config/db");

// @desc    Get aggregate stats for the homepage "Impact" section
exports.getImpactStats = async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        CAST((SELECT COUNT(*) FROM jobs WHERE is_active = true) AS INTEGER) as "activeJobs",
        CAST((SELECT COUNT(DISTINCT employer_id) FROM jobs WHERE is_active = true) AS INTEGER) as facilities,
        CAST((SELECT COUNT(*) FROM applications WHERE status = 'Hired') AS INTEGER) as placements,
        CAST((SELECT COUNT(DISTINCT location) FROM jobs WHERE is_active = true) AS INTEGER) as cities
    `;
    const stats = await pool.query(statsQuery);
    res.json(stats.rows[0]);
  } catch (err) {
    console.error("❌ Stats Query Error:", err.message);
    res.status(500).json({ message: "Stats error" });
  }
};