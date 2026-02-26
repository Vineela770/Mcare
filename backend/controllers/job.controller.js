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
        CASE 
          WHEN min_salary IS NOT NULL AND max_salary IS NOT NULL THEN 
            'Rs. ' || min_salary || ' - ' || max_salary || COALESCE(' ' || salary_period, '')
          WHEN min_salary IS NOT NULL THEN 
            'Rs. ' || min_salary || COALESCE(' ' || salary_period, '')
          ELSE 'Salary not disclosed'
        END as salary,
        CASE 
          WHEN min_salary IS NOT NULL AND max_salary IS NOT NULL THEN 
            'Rs. ' || min_salary || ' - ' || max_salary || COALESCE(' ' || salary_period, '')
          WHEN min_salary IS NOT NULL THEN 
            'Rs. ' || min_salary || COALESCE(' ' || salary_period, '')
          ELSE 'Salary not disclosed'
        END as salary_range,
        min_salary,
        max_salary,
        salary_period,
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
    console.error("❌ Fetch Jobs Error:", err);
    console.error("Error Stack:", err.stack);
    console.error("Error Details:", {
      message: err.message,
      code: err.code,
      detail: err.detail
    });
    res.status(500).json({ 
      message: "Error fetching jobs",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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