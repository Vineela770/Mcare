const pool = require("../config/db");

// 📂 1. Fetch Profile Data (Joins users and professional profile)
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT u.full_name, u.email, u.phone_number, u.location, u.dob, u.gender,
              p.experience_years, p.specialization, p.certifications, 
              p.languages, p.availability, p.expected_salary
       FROM users u
       LEFT JOIN candidate_profiles p ON u.id = p.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    res.json({ success: true, profile: result.rows[0] });
  } catch (err) {
    console.error("❌ Fetch Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Error fetching profile" });
  }
};

// 🔄 2. Update Profile Data (Updates both tables)
exports.updateProfile = async (req, res) => {
  const client = await pool.connect();
  try {
    const userId = req.user.id;
    const { 
      full_name, phone_number, location, dob, gender,
      experience_years, specialization, certifications, 
      languages, availability, expected_salary 
    } = req.body;

    await client.query('BEGIN');

    // Update basic personal info in 'users' table
    await client.query(
      `UPDATE users 
       SET full_name = $1, phone_number = $2, location = $3, dob = $4, gender = $5 
       WHERE id = $6`,
      [full_name, phone_number, location, dob, gender, userId]
    );

    // Update professional info in 'candidate_profiles' table
    // ✅ Uses ON CONFLICT to either insert a new profile or update the existing one
    const profileResult = await client.query(
      `INSERT INTO candidate_profiles 
         (user_id, specialization, experience_years, certifications, languages, availability, expected_salary)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) 
       DO UPDATE SET 
          specialization = EXCLUDED.specialization, 
          experience_years = EXCLUDED.experience_years, 
          certifications = EXCLUDED.certifications,
          languages = EXCLUDED.languages,
          availability = EXCLUDED.availability,
          expected_salary = EXCLUDED.expected_salary
       RETURNING *`,
      [userId, specialization, experience_years, certifications, languages, availability, expected_salary]
    );

    await client.query('COMMIT');
    
    // Combine the results for the frontend
    const updatedData = {
        full_name, phone_number, location, dob, gender,
        ...profileResult.rows[0]
    };

    res.json({ success: true, message: "Profile updated successfully!", profile: updatedData });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("❌ Profile Update Error:", err.message);
    res.status(500).json({ success: false, message: "Error updating profile" });
  } finally {
    client.release();
  }
};