const pool = require("../../config/db");

// GET SINGLE USER – full profile details for admin view
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        u.id,
        u.title,
        u.full_name AS name,
        u.email,
        u.role,
        u.phone_number,
        u.location,
        u.is_verified,
        u.profile_photo_url,
        u.created_at AS joined,
        CASE WHEN u.is_verified THEN 'Active' ELSE 'Inactive' END AS status,
        -- Candidate profile fields
        cp.qualification,
        cp.resume_url,
        cp.professional_summary,
        cp.dob,
        cp.gender,
        cp.highest_qualification,
        cp.current_experience,
        cp.current_position,
        cp.preferred_job_type,
        cp.preferred_location,
        cp.expected_salary,
        cp.willing_to_relocate,
        cp.interested_in_teaching,
        cp.experience,
        cp.work_experience,
        cp.education,
        cp.skills,
        cp.certifications,
        -- Employer profile fields
        ep.designation,
        ep.organization_name,
        ep.organization_category,
        ep.number_of_beds,
        ep.organization_city,
        ep.organization_address,
        ep.website_url,
        ep.description AS organization_description,
        -- Stats (candidates: applications count; HR: jobs posted count)
        (SELECT COUNT(*) FROM applications WHERE user_id = u.id) AS total_applications,
        (SELECT COUNT(*) FROM jobs WHERE employer_id = u.id) AS jobs_posted
      FROM users u
      LEFT JOIN candidate_profiles cp ON cp.user_id = u.id
      LEFT JOIN employer_profiles ep ON ep.user_id = u.id
      WHERE u.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

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