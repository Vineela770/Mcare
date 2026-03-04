const pool = require("../../config/db");

// GET ALL JOBS (from both jobs table and HR-posted mcare_job_posts)
exports.getJobs = async (req, res) => {
  try {
    // Combine rows from the main jobs table and HR-submitted postings
    // with real application counts and formatted posted date
    const jobsResult = await pool.query(`
      SELECT
        j.id,
        j.title,
        COALESCE(j.company_name, '') AS employer,
        j.location,
        j.job_type   AS type,
        CASE WHEN j.is_active THEN 'Active' ELSE 'Closed' END AS status,
        CONCAT(COALESCE(j.min_salary,''), CASE WHEN j.max_salary IS NOT NULL AND j.max_salary != '' THEN ' - ' || j.max_salary ELSE '' END) AS salary,
        j.description,
        j.requirements,
        COALESCE(app_count.count, 0)::int AS applications,
        'jobs'     AS source,
        j.created_at,
        TO_CHAR(j.created_at, 'DD Mon YYYY') AS posted
      FROM jobs j
      LEFT JOIN (
        SELECT job_id, COUNT(*)::int AS count FROM applications WHERE job_id IS NOT NULL GROUP BY job_id
      ) app_count ON app_count.job_id = j.id
      UNION ALL
      SELECT
        mjp.id,
        mjp.title,
        COALESCE(mjp.department, '') AS employer,
        mjp.location,
        mjp.job_type   AS type,
        INITCAP(COALESCE(mjp.status, 'Active')) AS status,
        mjp.salary,
        mjp.description,
        mjp.requirements,
        COALESCE(hr_app_count.count, 0)::int AS applications,
        'hr_post'  AS source,
        mjp.created_at,
        TO_CHAR(mjp.created_at, 'DD Mon YYYY') AS posted
      FROM mcare_job_posts mjp
      LEFT JOIN (
        SELECT hr_job_id, COUNT(*)::int AS count FROM applications WHERE hr_job_id IS NOT NULL GROUP BY hr_job_id
      ) hr_app_count ON hr_app_count.hr_job_id = mjp.id
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

// UPDATE JOB — accepts frontend field names (employer, type, status, salary) and backend names
exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const { source } = req.query; // optional hint: 'jobs' or 'hr_post'
  const body = req.body;

  // Normalize field names: frontend sends employer/type/status/salary, backend uses company_name/job_type/is_active/min_salary
  const title = body.title;
  const company_name = body.company_name || body.employer || '';
  const location = body.location;
  const job_type = body.job_type || body.type || 'Full-time';
  const is_active = body.is_active !== undefined ? body.is_active : (body.status === 'Active' || body.status === 'active');
  const salary = body.salary || '';
  const description = body.description || '';
  const requirements = body.requirements || '';

  try {
    // Determine which table to update
    const targetTable = source || body.source;

    if (targetTable === 'hr_post') {
      // Update mcare_job_posts table
      const statusVal = is_active ? 'active' : 'closed';
      const result = await pool.query(
        `UPDATE mcare_job_posts SET title=$1, department=$2, location=$3, job_type=$4, status=$5, salary=$6, description=$7, requirements=$8 WHERE id=$9 RETURNING *`,
        [title, company_name, location, job_type, statusVal, salary, description, requirements, id]
      );
      return res.json(result.rows[0]);
    }

    // Default: update jobs table
    // Parse salary string back to min/max if needed
    let min_salary = body.min_salary || '';
    let max_salary = body.max_salary || '';
    if (!body.min_salary && salary) {
      const parts = salary.split(' - ');
      min_salary = parts[0]?.trim() || salary;
      max_salary = parts[1]?.trim() || '';
    }
    const salary_period = body.salary_period || '';

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
