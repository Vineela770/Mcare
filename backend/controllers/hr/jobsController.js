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

// GET single HR job by ID
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT mjp.*, COALESCE(a.applicant_count, 0) AS applicants
       FROM mcare_job_posts mjp
       LEFT JOIN (SELECT job_id, COUNT(*) AS applicant_count FROM applications GROUP BY job_id) a
         ON a.job_id = mjp.id
       WHERE mjp.id = $1`, [id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Job not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE HR job
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title, department, location, job_type, experience,
      salary, positions, description, requirements, benefits, deadline, status
    } = req.body;
    const result = await pool.query(
      `UPDATE mcare_job_posts
       SET title        = COALESCE($1, title),
           department   = COALESCE($2, department),
           location     = COALESCE($3, location),
           job_type     = COALESCE($4, job_type),
           experience   = COALESCE($5, experience),
           salary       = COALESCE($6, salary),
           positions    = COALESCE($7, positions),
           description  = COALESCE($8, description),
           requirements = COALESCE($9, requirements),
           benefits     = COALESCE($10, benefits),
           deadline     = COALESCE($11, deadline),
           status       = COALESCE($12, status),
           updated_at   = NOW()
       WHERE id = $13
       RETURNING *`,
      [title, department, location, job_type, experience,
       salary, positions, description, requirements, benefits, deadline, status, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Job not found' });
    res.json(result.rows[0]);
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
