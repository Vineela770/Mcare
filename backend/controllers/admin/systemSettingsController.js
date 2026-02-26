const pool = require("../../config/db");

// GET SETTINGS
exports.getSettings = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM system_settings WHERE id = 1"
    );

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Get Settings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// UPDATE SETTINGS
exports.updateSettings = async (req, res) => {
  try {
    const {
      siteName,
      siteDescription,
      contactEmail,
      supportEmail,
      emailNotifications,
      smsNotifications,
      pushNotifications,
      twoFactorAuth,
      sessionTimeout,
      passwordExpiry,
      maintenanceMode,
      debugMode,
      autoBackup,
      backupFrequency
    } = req.body;

    await pool.query(`
      UPDATE system_settings SET
        site_name = $1,
        site_description = $2,
        contact_email = $3,
        support_email = $4,
        email_notifications = $5,
        sms_notifications = $6,
        push_notifications = $7,
        two_factor_auth = $8,
        session_timeout = $9,
        password_expiry = $10,
        maintenance_mode = $11,
        debug_mode = $12,
        auto_backup = $13,
        backup_frequency = $14,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [
      siteName,
      siteDescription,
      contactEmail,
      supportEmail,
      emailNotifications,
      smsNotifications,
      pushNotifications,
      twoFactorAuth,
      sessionTimeout,
      passwordExpiry,
      maintenanceMode,
      debugMode,
      autoBackup,
      backupFrequency
    ]);

    res.status(200).json({ message: "Settings updated successfully" });

  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
