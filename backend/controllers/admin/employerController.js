const pool = require("../../config/db");


// ================= GET ALL EMPLOYERS =================
exports.getEmployers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM employers ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employers" });
  }
};


// ================= GET SINGLE EMPLOYER =================
exports.getEmployerById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM employers WHERE id = $1",
      [id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employer" });
  }
};


// ================= ADD EMPLOYER =================
exports.addEmployer = async (req, res) => {
  const { name, contactPerson, email, phone, location, status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO employers (name, contact_person, email, phone, location, status)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, contactPerson, email, phone, location, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add employer" });
  }
};


// ================= UPDATE EMPLOYER =================
exports.updateEmployer = async (req, res) => {
  const { id } = req.params;
  const { name, contactPerson, email, phone, location, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE employers 
       SET name=$1, contact_person=$2, email=$3, phone=$4, location=$5, status=$6
       WHERE id=$7 RETURNING *`,
      [name, contactPerson, email, phone, location, status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update employer" });
  }
};


// ================= DELETE EMPLOYER =================
exports.deleteEmployer = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM employers WHERE id=$1", [id]);
    res.json({ message: "Employer deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete employer" });
  }
};