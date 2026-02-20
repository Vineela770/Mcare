const pool = require("../config/db");

// GET all alerts
exports.getCandidateAlerts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM mcare_candidate_alerts ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
