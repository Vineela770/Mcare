const pool = require("../../config/db");

// Get all activities with user info
exports.getActivities = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        al.id,
        al.action,
        al.description AS details,
        al.user_role,
        al.created_at AS time,
        u.full_name AS user,
        u.email
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const [totalResult, todayResult, weekResult, monthResult, loginResult, registerResult] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM activity_logs"),
      pool.query("SELECT COUNT(*) FROM activity_logs WHERE DATE(created_at) = CURRENT_DATE"),
      pool.query("SELECT COUNT(*) FROM activity_logs WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'"),
      pool.query("SELECT COUNT(*) FROM activity_logs WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)"),
      pool.query("SELECT COUNT(*) FROM activity_logs WHERE action = 'login'"),
      pool.query("SELECT COUNT(*) FROM activity_logs WHERE action = 'register'"),
    ]);

    res.json({
      totalActivities: parseInt(totalResult.rows[0].count),
      todayActivities: parseInt(todayResult.rows[0].count),
      thisWeek: parseInt(weekResult.rows[0].count),
      thisMonth: parseInt(monthResult.rows[0].count),
      loginCount: parseInt(loginResult.rows[0].count),
      registerCount: parseInt(registerResult.rows[0].count),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};

