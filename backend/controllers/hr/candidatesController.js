const pool = require("../../config/db");

// GET all candidates
exports.getCandidates = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM mcare_candidates ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE candidate status
exports.updateCandidateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query(
      "UPDATE mcare_candidates SET status=$1 WHERE id=$2",
      [status, id]
    );

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
