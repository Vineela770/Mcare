const pool = require("../../config/db");

// GET all interviews
exports.getInterviews = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, a.candidate_name
      FROM mcare_interviews i
      JOIN mcare_applications a ON i.application_id = a.id
      ORDER BY i.interview_date ASC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE interview
exports.createInterview = async (req, res) => {
  try {
    const {
      application_id,
      position,
      interview_date,
      interview_time,
      interview_type,
      interviewer,
      location
    } = req.body;

    await pool.query(
      `INSERT INTO mcare_interviews
       (application_id, position, interview_date, interview_time, interview_type, interviewer, location)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [application_id, position, interview_date, interview_time, interview_type, interviewer, location]
    );

    res.json({ message: "Interview scheduled successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE interview
exports.updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      position,
      interview_date,
      interview_time,
      interview_type,
      interviewer,
      location
    } = req.body;

    await pool.query(
      `UPDATE mcare_interviews
       SET position=$1,
           interview_date=$2,
           interview_time=$3,
           interview_type=$4,
           interviewer=$5,
           location=$6
       WHERE id=$7`,
      [position, interview_date, interview_time, interview_type, interviewer, location, id]
    );

    res.json({ message: "Interview updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
