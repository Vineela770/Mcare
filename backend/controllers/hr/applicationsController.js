const pool = require("../../config/db");

exports.getApplications = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        a.id,
        a.status,
        TO_CHAR(a.applied_at, 'DD Mon YYYY')         AS "appliedDate",
        u.full_name                                   AS "candidateName",
        u.email                                       AS email,
        UPPER(SUBSTRING(u.full_name FROM 1 FOR 1))   AS "candidateAvatar",
        COALESCE(cp.preferred_location, mjp.location, '') AS location,
        COALESCE(mjp.title, 'HR Job')                AS "jobTitle",
        COALESCE(cp.qualification, cp.highest_qualification, '') AS qualification,
        COALESCE(cp.current_experience, cp.experience, '')       AS experience,
        '—'                                           AS rating,
        a.cover_letter_path                           AS "coverLetter",
        a.hr_job_id                                   AS "jobId"
      FROM applications a
      JOIN users u ON u.id = a.user_id
      LEFT JOIN candidate_profiles cp ON cp.user_id = a.user_id
      LEFT JOIN mcare_job_posts mjp ON mjp.id = a.hr_job_id
      WHERE a.hr_job_id IS NOT NULL
      ORDER BY a.applied_at DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("HR getApplications error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query(
      "UPDATE applications SET status=$1 WHERE id=$2",
      [status, id]
    );

    res.json({ message: "Status updated successfully" });

  } catch (error) {
    console.error("HR updateStatus error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
