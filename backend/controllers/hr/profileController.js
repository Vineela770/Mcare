const pool = require("../../config/db");

// GET /api/hr/profile
// Returns employer_profiles + users data for the logged-in HR user
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone_number, u.location,
              ep.designation, ep.organization_name, ep.organization_category,
              ep.number_of_beds, ep.organization_city, ep.organization_address,
              ep.website_url, ep.description
       FROM users u
       LEFT JOIN employer_profiles ep ON ep.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    res.json(result.rows[0] || null);
  } catch (error) {
    console.error("getProfile error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// POST /api/hr/profile
// Saves to employer_profiles and updates users table
const saveProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      full_name,
      phone_number,
      location,
      designation,
      organization_name,
      organization_category,
      number_of_beds,
      organization_city,
      organization_address,
      website_url,
      description,
    } = req.body;

    // Update users table
    await pool.query(
      `UPDATE users SET
         full_name     = COALESCE($1, full_name),
         phone_number  = COALESCE($2, phone_number),
         location      = COALESCE($3, location),
         updated_at    = NOW()
       WHERE id = $4`,
      [full_name || null, phone_number || null, location || null, userId]
    );

    // Upsert employer_profiles
    await pool.query(
      `INSERT INTO employer_profiles
         (user_id, designation, organization_name, organization_category,
          number_of_beds, organization_city, organization_address, website_url, description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (user_id) DO UPDATE SET
         designation           = COALESCE(EXCLUDED.designation, employer_profiles.designation),
         organization_name     = COALESCE(EXCLUDED.organization_name, employer_profiles.organization_name),
         organization_category = COALESCE(EXCLUDED.organization_category, employer_profiles.organization_category),
         number_of_beds        = COALESCE(EXCLUDED.number_of_beds, employer_profiles.number_of_beds),
         organization_city     = COALESCE(EXCLUDED.organization_city, employer_profiles.organization_city),
         organization_address  = COALESCE(EXCLUDED.organization_address, employer_profiles.organization_address),
         website_url           = COALESCE(EXCLUDED.website_url, employer_profiles.website_url),
         description           = COALESCE(EXCLUDED.description, employer_profiles.description),
         updated_at            = NOW()`,
      [
        userId,
        designation || null,
        organization_name || null,
        organization_category || null,
        number_of_beds || null,
        organization_city || null,
        organization_address || null,
        website_url || null,
        description || null,
      ]
    );

    res.json({ success: true, message: "Profile saved successfully" });
  } catch (error) {
    console.error("saveProfile error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProfile, saveProfile };
