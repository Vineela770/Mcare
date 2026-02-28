const pool = require("../../config/db");

// GET ALL APPLICATIONS (admin view — all candidates across all jobs)
exports.getAllApplications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.status,
        a.created_at AS applied_at,
        a.cover_letter_path AS cover_letter_url,
        -- Candidate info
        u.id          AS user_id,
        u.full_name   AS candidate_name,
        u.email       AS candidate_email,
        u.phone       AS candidate_phone,
        cp.qualification,
        cp.resume_url,
        -- Job info (from either table)
        COALESCE(j.id::text, mjp.id::text)               AS job_id,
        COALESCE(j.title, mjp.title)                     AS job_title,
        COALESCE(j.location, mjp.location)               AS job_location,
        COALESCE(j.job_type, mjp.job_type)               AS job_type,
        -- Employer info
        COALESCE(ep.organization_name, 'MCARE HR')       AS employer_name,
        COALESCE(eu.full_name, 'HR Admin')               AS employer_contact,
        COALESCE(eu.email, '')                           AS employer_email
      FROM applications a
      JOIN users u ON u.id = a.user_id
      LEFT JOIN candidate_profiles cp ON cp.user_id = u.id
      LEFT JOIN jobs j ON j.id = a.job_id
      LEFT JOIN mcare_job_posts mjp ON mjp.id = a.hr_job_id
      LEFT JOIN employer_profiles ep ON ep.user_id = j.employer_id
      LEFT JOIN users eu ON eu.id = j.employer_id
      ORDER BY a.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Get All Applications Error:", error);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

// GET APPLICATIONS FOR A SPECIFIC USER (admin drill-down)
exports.getUserApplications = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        a.status,
        a.created_at AS applied_at,
        a.cover_letter_url,
        j.id       AS job_id,
        j.title    AS job_title,
        j.location AS job_location,
        j.job_type,
        ep.organization_name AS employer_name
      FROM applications a
      JOIN jobs j ON j.id = a.job_id
      LEFT JOIN employer_profiles ep ON ep.user_id = j.employer_id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
    `, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error("Get User Applications Error:", error);
    res.status(500).json({ error: "Failed to fetch user applications" });
  }
};

// GET APPLICATION STATS (counts per status)
exports.getApplicationStats = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        status,
        COUNT(*) AS count
      FROM applications
      GROUP BY status
      ORDER BY count DESC
    `);
    const total = await pool.query(`SELECT COUNT(*) AS total FROM applications`);
    res.json({
      total: parseInt(total.rows[0].total) || 0,
      byStatus: result.rows,
    });
  } catch (error) {
    console.error("Get Application Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch application stats" });
  }
};
