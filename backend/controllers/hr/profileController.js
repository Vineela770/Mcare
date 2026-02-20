const pool = require("../config/db");

const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM organization_settings ORDER BY id DESC LIMIT 1"
    );
    res.json(result.rows[0] || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

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
