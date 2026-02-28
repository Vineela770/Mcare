const pool = require("../../config/db");

// GET ALL JOBS (from both jobs table and HR-posted mcare_job_posts)
exports.getJobs = async (req, res) => {
  try {
    // Combine rows from the main jobs table and HR-submitted postings
    const jobsResult = await pool.query(`
      SELECT
        id,
        title,
        COALESCE(company_name, '') AS employer,
        location,
        job_type   AS type,
        CASE WHEN is_active THEN 'Active' ELSE 'Closed' END AS status,
        CONCAT(COALESCE(min_salary,''), CASE WHEN max_salary IS NOT NULL AND max_salary != '' THEN ' - ' || max_salary ELSE '' END) AS salary,
        description,
        requirements,
        0          AS applications,
        'jobs'     AS source,
        created_at
      FROM jobs
      UNION ALL
      SELECT
        id,
        title,
        COALESCE(department, '') AS employer,
        location,
        job_type   AS type,
        INITCAP(COALESCE(status, 'Active')) AS status,
        salary,
        description,
        requirements,
        0          AS applications,
        'hr_post'  AS source,
        created_at
      FROM mcare_job_posts
      ORDER BY created_at DESC
    `);
    res.json(jobsResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

// ADD JOB
exports.createJob = async (req, res) => {
  const { title, company_name, location, job_type, is_active, min_salary, max_salary, salary_period, description, requirements } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO jobs (title, company_name, location, job_type, is_active, min_salary, max_salary, salary_period, description, requirements, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,NOW()) RETURNING *",
      [title, company_name, location, job_type || 'Full-time', is_active !== false, min_salary, max_salary, salary_period, description, requirements]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create job" });
  }
};

// UPDATE JOB
exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const { title, company_name, location, job_type, is_active, min_salary, max_salary, salary_period, description, requirements } = req.body;

  try {
    const result = await pool.query(
      "UPDATE jobs SET title=$1, company_name=$2, location=$3, job_type=$4, is_active=$5, min_salary=$6, max_salary=$7, salary_period=$8, description=$9, requirements=$10 WHERE id=$11 RETURNING *",
      [title, company_name, location, job_type, is_active, min_salary, max_salary, salary_period, description, requirements, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update job" });
  }
};

// DELETE JOB (checks both tables)
exports.deleteJob = async (req, res) => {
  const { id } = req.params;
  const { source } = req.query; // optional hint: 'jobs' or 'hr_post'

  try {
    if (source === 'hr_post') {
      await pool.query("DELETE FROM mcare_job_posts WHERE id=$1", [id]);
    } else if (source === 'jobs') {
      await pool.query("DELETE FROM jobs WHERE id=$1", [id]);
    } else {
      // Try both tables
      const r1 = await pool.query("DELETE FROM jobs WHERE id=$1 RETURNING id", [id]);
      if (r1.rowCount === 0) {
        await pool.query("DELETE FROM mcare_job_posts WHERE id=$1", [id]);
      }
    }
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete job" });
  }
};
