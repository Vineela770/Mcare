const pool = require("../../config/db");

// GET ALL USERS (with candidate/employer profile info)
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.full_name AS name,
        u.email,
        u.role,
        u.phone_number,
        u.location,
        u.is_verified,
        u.created_at AS joined,
        CASE WHEN u.is_verified THEN 'Active' ELSE 'Inactive' END AS status,
        cp.qualification,
        ep.organization_name,
        ep.designation
      FROM users u
      LEFT JOIN candidate_profiles cp ON cp.user_id = u.id AND u.role = 'candidate'
      LEFT JOIN employer_profiles ep ON ep.user_id = u.id AND u.role = 'hr'
      ORDER BY u.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// GET USERS BY ROLE (doctor/candidate or hr/employer)
exports.getUsersByRole = async (req, res) => {
  const { role } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
        u.id,
        u.full_name AS name,
        u.email,
        u.role,
        u.phone_number,
        u.location,
        u.is_verified,
        u.created_at AS joined,
        CASE WHEN u.is_verified THEN 'Active' ELSE 'Inactive' END AS status,
        cp.qualification,
        ep.organization_name,
        ep.designation
      FROM users u
      LEFT JOIN candidate_profiles cp ON cp.user_id = u.id AND u.role = 'candidate'
      LEFT JOIN employer_profiles ep ON ep.user_id = u.id AND u.role = 'hr'
      WHERE u.role = $1
      ORDER BY u.created_at DESC`,
      [role]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch Users By Role Error:", error);
    res.status(500).json({ error: "Failed to fetch users by role" });
  }
};

// ADD USER
exports.createUser = async (req, res) => {
  const { name, email, role, status } = req.body;

  try {
    const isVerified = status === 'Active';
    const result = await pool.query(
      `INSERT INTO users (full_name, email, role, is_verified, password)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name AS name, email, role, is_verified, created_at AS joined`,
      [name, email, role || 'candidate', isVerified, 'admin_created']
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  try {
    const isVerified = status === 'Active';
    const result = await pool.query(
      `UPDATE users SET full_name=$1, email=$2, role=$3, is_verified=$4, updated_at=NOW()
       WHERE id=$5
       RETURNING id, full_name AS name, email, role, is_verified, created_at AS joined`,
      [name, email, role, isVerified, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};