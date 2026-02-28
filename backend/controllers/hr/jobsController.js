const pool = require("../../config/db");

// GET all HR-posted jobs from mcare_job_posts
exports.getJobs = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         mjp.*,
         COALESCE(a.applicant_count, 0) AS applicants
       FROM mcare_job_posts mjp
       LEFT JOIN (
         SELECT job_id, COUNT(*) AS applicant_count
         FROM applications
         GROUP BY job_id
       ) a ON a.job_id = mjp.id
       ORDER BY mjp.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE job from mcare_job_posts
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM mcare_job_posts WHERE id = $1", [id]);

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
