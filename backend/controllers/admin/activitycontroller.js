const pool = require("../../config/db");

// Get all activities
exports.getActivities = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM activity_logs ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalActivities = await pool.query(
      "SELECT COUNT(*) FROM activity_logs"
    );

    res.json({
      totalActivities: totalActivities.rows[0].count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
