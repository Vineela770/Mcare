const pool = require("../../config/db");

exports.createJob = async (req, res) => {
  try {
    const {
      title,
      department,
      location,
      phone,
      jobType,
      experience,
      salary,
      positions,
      description,
      requirements,
      benefits,
      deadline
    } = req.body;

    const result = await pool.query(
      `INSERT INTO mcare_job_posts
      (title, department, location, phone, job_type,
       experience, salary, positions,
       description, requirements, benefits,
       deadline, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        title,
        department,
        location,
        phone,
        jobType,
        experience,
        salary,
        positions,
        description,
        requirements,
        benefits,
        deadline,
        "active"
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
