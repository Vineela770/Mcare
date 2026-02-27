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

const saveProfile = async (req, res) => {
  try {
    const {
      companyName,
      email,
      phoneCountryCode,
      phone,
      alternatePhoneCountryCode,
      alternatePhone,
      location,
      about,
      notifications = {}
    } = req.body;

    const existing = await pool.query(
      "SELECT * FROM organization_settings LIMIT 1"
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE organization_settings SET
         company_name=$1,
         email=$2,
         phone_country_code=$3,
         phone=$4,
         alternate_phone_country_code=$5,
         alternate_phone=$6,
         location=$7,
         about=$8,
         email_alerts=$9,
         application_updates=$10,
         interview_reminders=$11,
         weekly_reports=$12,
         updated_at=NOW()
         WHERE id=$13`,
        [
          companyName,
          email,
          phoneCountryCode,
          phone,
          alternatePhoneCountryCode,
          alternatePhone,
          location,
          about,
          notifications.emailAlerts ?? true,
          notifications.applicationUpdates ?? true,
          notifications.interviewReminders ?? true,
          notifications.weeklyReports ?? false,
          existing.rows[0].id
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO organization_settings
        (company_name,email,phone_country_code,phone,
         alternate_phone_country_code,alternate_phone,
         location,about,
         email_alerts,application_updates,
         interview_reminders,weekly_reports)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
        [
          companyName,
          email,
          phoneCountryCode,
          phone,
          alternatePhoneCountryCode,
          alternatePhone,
          location,
          about,
          notifications.emailAlerts ?? true,
          notifications.applicationUpdates ?? true,
          notifications.interviewReminders ?? true,
          notifications.weeklyReports ?? false
        ]
      );
    }

    res.json({ message: "Profile saved successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getProfile,
  saveProfile
};
