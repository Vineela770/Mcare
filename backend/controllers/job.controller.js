const pool = require("../config/db");

// @desc    Get all jobs for the listing page (both admin jobs + HR-posted jobs)
exports.getAllJobs = async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        title,
        company_name,
        company_name AS company,
        location,
        CASE 
          WHEN min_salary IS NOT NULL AND max_salary IS NOT NULL THEN 
            'Rs. ' || min_salary || ' - ' || max_salary || COALESCE(' ' || salary_period, '')
          WHEN min_salary IS NOT NULL THEN 
            'Rs. ' || min_salary || COALESCE(' ' || salary_period, '')
          ELSE 'Salary not disclosed'
        END AS salary,
        job_type,
        job_type AS type,
        created_at,
        description,
        requirements,
        'platform' AS source,
        CASE
          WHEN LOWER(job_type) LIKE '%nurs%'       THEN 'nursing'
          WHEN LOWER(job_type) LIKE '%dental%'      THEN 'dental'
          WHEN LOWER(job_type) LIKE '%allied%'      THEN 'allied'
          WHEN LOWER(job_type) LIKE '%management%'  THEN 'management'
          WHEN LOWER(job_type) LIKE '%college%'     THEN 'colleges'
          WHEN LOWER(job_type) LIKE '%alternative%' THEN 'alternative'
          ELSE 'doctors'
        END AS categoryKey,
        COALESCE(job_type, 'doctors') AS category
      FROM jobs 
      WHERE is_active = true

      UNION ALL

      SELECT
        id,
        title,
        COALESCE(department, 'MCARE') AS company_name,
        COALESCE(department, 'MCARE') AS company,
        location,
        COALESCE(salary, 'Salary not disclosed') AS salary,
        COALESCE(job_type, 'Full-time') AS job_type,
        COALESCE(job_type, 'Full-time') AS type,
        created_at,
        description,
        requirements,
        'hr' AS source,
        CASE
          WHEN LOWER(department) LIKE '%nurs%'        THEN 'nursing'
          WHEN LOWER(department) LIKE '%dental%'       THEN 'dental'
          WHEN LOWER(department) LIKE '%allied%'       THEN 'allied'
          WHEN LOWER(department) LIKE '%management%'   THEN 'management'
          WHEN LOWER(department) LIKE '%college%'      THEN 'colleges'
          WHEN LOWER(department) LIKE '%alternative%'  THEN 'alternative'
          ELSE 'doctors'
        END AS categoryKey,
        COALESCE(department, 'doctors') AS category
      FROM mcare_job_posts
      WHERE status = 'active'

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