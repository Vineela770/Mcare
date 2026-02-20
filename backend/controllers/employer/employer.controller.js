const pool = require("../../config/db");

// @desc    Employer posts a new healthcare job
exports.postJob = async (req, res) => {
  try {
    const { 
      title, company_name, category, city, 
      min_salary, max_salary, salary_period, 
      job_type, description 
    } = req.body;
    
    const employerId = req.user.id; // From verifyToken

    const newJob = await pool.query(
      `INSERT INTO jobs 
       (employer_id, title, company_name, category, city, min_salary, max_salary, salary_period, job_type, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [employerId, title, company_name, category, city, min_salary, max_salary, salary_period, job_type, description]
    );

    res.status(201).json({ message: "Job posted successfully", job: newJob.rows[0] });
  } catch (err) {
    console.error("❌ Post Job Error:", err.message);
    res.status(500).json({ message: "Error posting job" });
  }
};

// @desc    Get applicants for jobs posted by this employer
exports.getJobApplicants = async (req, res) => {
  try {
    const employerId = req.user.id;
    const query = `
      SELECT a.id as application_id, a.status, a.applied_at, 
             u.full_name as candidate_name, u.email as candidate_email,
             j.title as job_title
      FROM applications a
      JOIN jobs j ON a.job_id = j.id
      JOIN users u ON a.user_id = u.id
      WHERE j.employer_id = $1
      ORDER BY a.applied_at DESC
    `;
    const result = await pool.query(query, [employerId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching applicants" });
  }
};