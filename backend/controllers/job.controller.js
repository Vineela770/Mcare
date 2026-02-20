const pool = require("../config/db");

// @desc    Get all jobs for the listing page
exports.getAllJobs = async (req, res) => {
  try {
    const query = `
      SELECT 
        id, 
        title, 
        company_name, 
        location,
        salary,
        salary_range, 
        job_type, 
        is_active,
        created_at,
        description,
        requirements
      FROM jobs 
      WHERE is_active = true
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Fetch Jobs Error:", err.message);
    res.status(500).json({ message: "Error fetching jobs" });
  }
};

// @desc    Get a single job's details
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM jobs WHERE id = $1", [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job details" });
  }
};