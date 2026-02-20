const pool = require("../config/db");
const bcrypt = require("bcrypt");

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const { hrId, oldPassword, newPassword } = req.body;

    const result = await pool.query(
      "SELECT * FROM mcare_hr WHERE id = $1",
      [hrId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hr = result.rows[0];

    const isMatch = await bcrypt.compare(oldPassword, hr.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE mcare_hr SET password = $1 WHERE id = $2",
      [hashedPassword, hrId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
