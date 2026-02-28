const pool = require("../../config/db");

// GET ALL APPLICATIONS (admin view — all candidates across all jobs)
exports.getAllApplications = async (req, res) => {
  try {
    // Full query: joins both jobs and mcare_job_posts (HR-posted jobs)
    const result = await pool.query(`
      SELECT 
        a.id,
        a.status,
        a.applied_at,
        a.cover_letter_path AS cover_letter_url,
        u.id          AS user_id,
        u.full_name   AS candidate_name,
        u.email       AS candidate_email,
        cp.qualification,
        cp.resume_url,
        CASE
          WHEN a.job_id IS NOT NULL THEN a.job_id::text
          ELSE COALESCE(a.hr_job_id::text, 'N/A')
        END                                                  AS job_id,
        COALESCE(j.title,  mjp.title,  'Unknown Job')        AS job_title,
        COALESCE(j.location, mjp.location, '')               AS job_location,
        COALESCE(j.job_type, mjp.job_type, '')               AS job_type,
        COALESCE(ep.organization_name, 'MCARE HR')           AS employer_name,
        COALESCE(eu.full_name, 'HR Admin')                   AS employer_contact,
        COALESCE(eu.email, '')                               AS employer_email
      FROM applications a
      JOIN  users u  ON u.id  = a.user_id
      LEFT JOIN candidate_profiles cp ON cp.user_id = u.id
      LEFT JOIN jobs             j   ON j.id   = a.job_id
      LEFT JOIN mcare_job_posts  mjp ON mjp.id  = a.hr_job_id
      LEFT JOIN employer_profiles ep ON ep.user_id = j.employer_id
      LEFT JOIN users            eu  ON eu.id   = j.employer_id
      ORDER BY a.applied_at DESC
    `);
    return res.json(result.rows);
  } catch (fullErr) {
    console.error("getAllApplications full-query error:", fullErr.message);
    // Fallback: simpler query without mcare_job_posts (in case hr_job_id column missing)
    try {
      const fallback = await pool.query(`
        SELECT
          a.id,
          a.status,
          a.applied_at,
          a.cover_letter_path AS cover_letter_url,
          u.id              AS user_id,
          u.full_name       AS candidate_name,
          u.email           AS candidate_email,
          cp.qualification,
          cp.resume_url,
          COALESCE(a.job_id::text, 'N/A')           AS job_id,
          COALESCE(j.title,  'Unknown Job')          AS job_title,
          COALESCE(j.location, '')                  AS job_location,
          COALESCE(j.job_type, '')                  AS job_type,
          COALESCE(ep.organization_name, 'MCARE HR') AS employer_name,
          COALESCE(eu.full_name, 'HR Admin')         AS employer_contact,
          COALESCE(eu.email, '')                    AS employer_email
        FROM applications a
        JOIN  users u  ON u.id = a.user_id
        LEFT JOIN candidate_profiles cp ON cp.user_id = u.id
        LEFT JOIN jobs             j   ON j.id = a.job_id
        LEFT JOIN employer_profiles ep ON ep.user_id = j.employer_id
        LEFT JOIN users            eu  ON eu.id = j.employer_id
        ORDER BY a.applied_at DESC
      `);
      return res.json(fallback.rows);
    } catch (fallbackErr) {
      console.error("getAllApplications fallback error:", fallbackErr.message);
      return res.status(500).json({ error: "Failed to fetch applications" });
    }
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
        a.applied_at,
        a.cover_letter_path AS cover_letter_url,
        COALESCE(j.id::text, mjp.id::text) AS job_id,
        COALESCE(j.title, mjp.title)       AS job_title,
        COALESCE(j.location, mjp.location) AS job_location,
        COALESCE(j.job_type, mjp.job_type) AS job_type,
        COALESCE(ep.organization_name, 'MCARE HR') AS employer_name
      FROM applications a
      LEFT JOIN jobs j ON j.id = a.job_id
      LEFT JOIN mcare_job_posts mjp ON mjp.id = a.hr_job_id
      LEFT JOIN employer_profiles ep ON ep.user_id = j.employer_id
      WHERE a.user_id = $1
      ORDER BY a.applied_at DESC
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
    const [statusResult, totalResult] = await Promise.all([
      pool.query(`SELECT status, COUNT(*)::int AS count FROM applications GROUP BY status ORDER BY count DESC`),
      pool.query(`SELECT COUNT(*)::int AS total FROM applications`),
    ]);
    res.json({
      total: totalResult.rows[0]?.total || 0,
      byStatus: statusResult.rows,
    });
  } catch (error) {
    console.error("Get Application Stats Error:", error);
    // Return safe empty shape so the frontend doesn't crash
    res.json({ total: 0, byStatus: [] });
  }
};
