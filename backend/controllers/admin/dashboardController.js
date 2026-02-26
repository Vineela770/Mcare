const pool = require("../../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await pool.query("SELECT COUNT(*) FROM users");
    const totalJobs = await pool.query("SELECT COUNT(*) FROM jobs");
    const totalEmployers = await pool.query("SELECT COUNT(*) FROM employers");

    const activeToday = await pool.query(`
      SELECT COUNT(*) FROM activity_logs
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalJobs: parseInt(totalJobs.rows[0].count),
      employers: parseInt(totalEmployers.rows[0].count),
      activeToday: parseInt(activeToday.rows[0].count),
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};
