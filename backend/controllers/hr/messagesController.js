const pool = require("../../config/db");

const relativeTime = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

// GET /api/hr/messages/conversations
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
         conv.other_id,
         u.full_name AS candidate_name,
         u.profile_photo_url AS photo,
         lm.last_message,
         conv.last_at,
         uc.unread_count
       FROM (
         SELECT
           CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END AS other_id,
           MAX(m.sent_at) AS last_at
         FROM messages m
         WHERE m.sender_id = $1 OR m.receiver_id = $1
         GROUP BY other_id
       ) conv
       JOIN users u ON u.id = conv.other_id
       LEFT JOIN LATERAL (
         SELECT message_text AS last_message
         FROM messages
         WHERE (sender_id = $1 AND receiver_id = conv.other_id)
            OR (sender_id = conv.other_id AND receiver_id = $1)
         ORDER BY sent_at DESC LIMIT 1
       ) lm ON true
       LEFT JOIN LATERAL (
         SELECT COUNT(*) AS unread_count
         FROM messages
         WHERE sender_id = conv.other_id AND receiver_id = $1 AND is_read = FALSE
       ) uc ON true
       ORDER BY conv.last_at DESC`,
      [userId]
    );

    const conversations = result.rows.map(r => ({
      ...r,
      last_time: relativeTime(r.last_at),
    }));

    res.json({ success: true, conversations });
  } catch (err) {
    console.error("HR getConversations error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch conversations" });
  }
};

// GET /api/hr/messages/conversation/:otherUserId
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    // Mark incoming messages as read
    await pool.query(
      `UPDATE messages SET is_read = TRUE
       WHERE sender_id = $1 AND receiver_id = $2 AND is_read = FALSE`,
      [otherUserId, userId]
    );

    const result = await pool.query(
      `SELECT m.id, m.sender_id, m.receiver_id, m.message_text, m.sent_at,
              u.full_name AS sender_name
       FROM messages m
       JOIN users u ON u.id = m.sender_id
       WHERE (m.sender_id = $1 AND m.receiver_id = $2)
          OR (m.sender_id = $2 AND m.receiver_id = $1)
       ORDER BY m.sent_at ASC`,
      [userId, otherUserId]
    );

    res.json({ success: true, messages: result.rows });
  } catch (err) {
    console.error("HR getMessages error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch messages" });
  }
};

// POST /api/hr/messages/send
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, message_text } = req.body;

    if (!receiver_id || !message_text || !message_text.trim()) {
      return res.status(400).json({ success: false, message: "receiver_id and message_text required" });
    }

    const check = await pool.query("SELECT id FROM users WHERE id = $1", [receiver_id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Recipient not found" });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, message_text)
       VALUES ($1, $2, $3) RETURNING id, sender_id, receiver_id, message_text, sent_at`,
      [req.user.id, receiver_id, message_text.trim()]
    );

    res.status(201).json({ success: true, message: result.rows[0] });
  } catch (err) {
    console.error("HR sendMessage error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

// GET /api/hr/messages/search?q=...
exports.searchCandidates = async (req, res) => {
  try {
    const { q } = req.query;
    const param = q && q.trim() ? `%${q.trim()}%` : '%';

    const result = await pool.query(
      `SELECT u.id, u.full_name AS name, u.profile_photo_url AS photo,
              cp.current_job_title AS title, cp.location
       FROM users u
       LEFT JOIN candidate_profiles cp ON cp.user_id = u.id
       WHERE u.role = 'candidate' AND u.full_name ILIKE $1
       ORDER BY u.full_name
       LIMIT 20`,
      [param]
    );

    res.json({ success: true, candidates: result.rows });
  } catch (err) {
    console.error("HR searchCandidates error:", err.message);
    res.status(500).json({ success: false, message: "Failed to search candidates" });
  }
};
