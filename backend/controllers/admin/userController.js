
// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ADD USER
exports.createUser = async (req, res) => {
  const { name, email, role, status } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO users (name, email, role, status, joined) VALUES ($1,$2,$3,$4,CURRENT_DATE) RETURNING *",
      [name, email, role, status]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;

  try {
    const result = await pool.query(
      "UPDATE users SET name=$1, email=$2, role=$3, status=$4 WHERE id=$5 RETURNING *",
      [name, email, role, status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM users WHERE id=$1", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};