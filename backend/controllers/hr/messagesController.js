const pool = require("../config/db");

// Get all conversations
exports.getConversations = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id,
             a.candidate_name,
             a.qualification,
             MAX(m.message) AS last_message,
             MAX(m.created_at) AS last_time
      FROM mcare_conversations c
      JOIN mcare_applications a ON c.candidate_id = a.id
      LEFT JOIN mcare_messages m ON m.conversation_id = c.id
      GROUP BY c.id, a.candidate_name, a.qualification
      ORDER BY last_time DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get messages by conversation
exports.getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM mcare_messages WHERE conversation_id=$1 ORDER BY created_at ASC",
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { conversation_id, message } = req.body;

    await pool.query(
      "INSERT INTO mcare_messages (conversation_id, sender, message) VALUES ($1,'hr',$2)",
      [conversation_id, message]
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
