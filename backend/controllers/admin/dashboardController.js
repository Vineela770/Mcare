const pool = require("../../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await pool.query("SELECT COUNT(*) FROM users");

    // Role-based counts
    const totalDoctors = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'candidate'"
    );
    const totalHR = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'hr'"
    );
    const totalAdmins = await pool.query(
      "SELECT COUNT(*) FROM users WHERE role = 'admin'"
    );

    // Total active jobs
    const totalJobs = await pool.query(
      "SELECT COUNT(*) FROM jobs WHERE is_active = TRUE"
    );

    // Total employer profiles registered
    const totalEmployers = await pool.query(
      "SELECT COUNT(*) FROM employer_profiles"
    );

    // Active today (from activity_logs)
    const activeToday = await pool.query(`
      SELECT COUNT(*) FROM activity_logs
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    // New registrations today
    const registeredToday = await pool.query(`
      SELECT COUNT(*) FROM users
      WHERE DATE(created_at) = CURRENT_DATE
    `);

    // Doctors registered today
    const doctorsToday = await pool.query(`
      SELECT COUNT(*) FROM users
      WHERE role = 'candidate' AND DATE(created_at) = CURRENT_DATE
    `);

    // Employers (HR) registered today
    const employersToday = await pool.query(`
      SELECT COUNT(*) FROM users
      WHERE role = 'hr' AND DATE(created_at) = CURRENT_DATE
    `);

    // Total applications
    const totalApplications = await pool.query("SELECT COUNT(*) FROM applications");

    // Recent registrations (last 10 users)
    const recentRegistrations = await pool.query(`
      SELECT id, full_name, email, role, is_verified, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 10
    `);

    // Recent activity logs with user info
    const recentActivity = await pool.query(`
      SELECT 
        al.id,
        al.action,
        al.description,
        al.user_role,
        al.created_at,
        u.full_name,
        u.email
      FROM activity_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 20
    `);

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalDoctors: parseInt(totalDoctors.rows[0].count),
      totalHR: parseInt(totalHR.rows[0].count),
      totalAdmins: parseInt(totalAdmins.rows[0].count),
      totalJobs: parseInt(totalJobs.rows[0].count),
      totalEmployers: parseInt(totalEmployers.rows[0].count),
      activeToday: parseInt(activeToday.rows[0].count),
      registeredToday: parseInt(registeredToday.rows[0].count),
      doctorsRegisteredToday: parseInt(doctorsToday.rows[0].count),
      employersRegisteredToday: parseInt(employersToday.rows[0].count),
      totalApplications: parseInt(totalApplications.rows[0].count),
      recentRegistrations: recentRegistrations.rows,
      recentActivity: recentActivity.rows,
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to load dashboard data" });
  }
};
