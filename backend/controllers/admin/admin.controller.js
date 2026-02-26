const pool = require("../../config/db");

// @desc    Toggle whether a job is featured on the homepage
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;

    const result = await pool.query(
      "UPDATE jobs SET is_featured = $1 WHERE id = $2 RETURNING id, title, is_featured",
      [is_featured, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ message: "Job status updated", job: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Admin update error" });
  }
};