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
  const { title, employer, location, type, status, salary, description, requirements } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO jobs (title, employer, location, type, status, salary, description, requirements, created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW()) RETURNING *",
      [title, employer, location, type, status, salary, description, requirements]
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
  const { title, employer, location, type, status, salary, description, requirements } = req.body;

  try {
    const result = await pool.query(
      "UPDATE jobs SET title=$1, employer=$2, location=$3, type=$4, status=$5, salary=$6, description=$7, requirements=$8 WHERE id=$9 RETURNING *",
      [title, employer, location, type, status, salary, description, requirements, id]
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
