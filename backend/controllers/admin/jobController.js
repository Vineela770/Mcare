const pool = require("../db");

// GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs ORDER BY id DESC");
    res.json(result.rows);
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

// DELETE JOB
exports.deleteJob = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM jobs WHERE id=$1", [id]);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete job" });
  }
};
