const pool = require("../../config/db");

exports.getApplications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.*,
        j.title AS job_title
      FROM mcare_applications a
      JOIN mcare_job_posts j ON a.job_id = j.id
      ORDER BY a.id DESC
    `);

    res.json(result.rows);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query(
      "UPDATE mcare_applications SET status=$1 WHERE id=$2",
      [status, id]
    );

    res.json({ message: "Status updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
