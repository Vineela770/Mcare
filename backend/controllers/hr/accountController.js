const pool = require("../config/db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");


// ✅ DELETE PROFILE
exports.deleteAccount = async (req, res) => {
  try {
    const { hrId, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM mcare_hr WHERE id = $1",
      [hrId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    await pool.query("DELETE FROM mcare_hr WHERE id = $1", [hrId]);

    res.json({ message: "Profile deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ SEND RECOVERY EMAIL
exports.sendRecoveryMail = async (req, res) => {
  try {
    const { email } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yourgmail@gmail.com",
        pass: "your_app_password"
      }
    });

    await transporter.sendMail({
      from: "yourgmail@gmail.com",
      to: email,
      subject: "Mcare Profile Recovery",
      html: `
        <h2>Profile Recovery Request</h2>
        <p>If you deleted your account and need help, please contact support.</p>
        <p>Mcare Team</p>
      `
    });

    res.json({ message: "Recovery email sent successfully" });

  } catch (error) {
    res.status(500).json({ message: "Mail sending failed" });
  }
};
