const pool = require("../config/db");

// Handle contact form submission
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    await pool.query(
      "INSERT INTO contact_inquiries (name, email, subject, message) VALUES ($1, $2, $3, $4)",
      [name, email, subject, message]
    );
    res.status(201).json({ message: "Your message has been sent. We'll be in touch soon!" });
  } catch (err) {
    res.status(500).json({ message: "Error saving inquiry" });
  }
};

// Fetch FAQ data for the UI
exports.getFAQs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM faqs ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching FAQs" });
  }
};