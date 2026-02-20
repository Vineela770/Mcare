const pool = require("../config/db");

// GET all packages
exports.getPackages = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM mcare_packages ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
