const pool = require("../config/db");

// Helper: format relative time
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

// GET /api/candidate/messages/search?q=...
// Search HR users to start a new conversation
exports.searchContacts = async (req, res) => {
  try {
    const { q } = req.query;
    const searchParam = q && q.trim() ? `%${q.trim()}%` : '%';

    const result = await pool.query(
      `SELECT u.id, u.full_name AS name, u.profile_photo_url AS photo,
              ep.organization_name, ep.organization_city AS city
       FROM users u
       LEFT JOIN employer_profiles ep ON ep.user_id = u.id
       WHERE u.role = 'hr' AND u.full_name ILIKE $1
       ORDER BY u.full_name
       LIMIT 20`,
      [searchParam]
    );
    res.json({ success: true, contacts: result.rows });
  } catch (err) {
    console.error("searchContacts error:", err.message);
    res.status(500).json({ success: false, message: "Error searching contacts" });
  }
};

// GET /api/candidate/messages/conversations
// All HR users this candidate has exchanged messages with
exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT
         other_id,
         full_name,
         profile_photo_url AS photo,
         organization_name,
         last_message,
         last_at,
         unread_count
       FROM (
         SELECT
           CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END AS other_id,
           MAX(m.sent_at) AS last_at
         FROM messages m
         WHERE m.sender_id = $1 OR m.receiver_id = $1
         GROUP BY other_id
       ) conv
       JOIN users u ON u.id = conv.other_id
       LEFT JOIN employer_profiles ep ON ep.user_id = conv.other_id
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
       ORDER BY last_at DESC`,
      [userId]
    );

    const rows = result.rows.map(r => ({
      ...r,
      last_at_relative: relativeTime(r.last_at),
    }));

    res.json({ success: true, conversations: rows });
  } catch (err) {
    console.error("getConversations error:", err.message);
    res.status(500).json({ success: false, message: "Error fetching conversations" });
  }
};

// GET /api/candidate/messages/history/:otherUserId
// Full chat history between this user and another
exports.getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    // Mark messages from the other user as read
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
    console.error("getChatHistory error:", err.message);
    res.status(500).json({ success: false, message: "Error fetching messages" });
  }
};

// POST /api/candidate/messages/send
// Send a message to a specific user
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, message_text } = req.body;

    if (!receiver_id || !message_text || !message_text.trim()) {
      return res.status(400).json({ success: false, message: "receiver_id and message_text are required" });
    }

    // Verify receiver exists
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
    console.error("sendMessage error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

    try {
        const { query } = req.query;
        
        // ✅ UI FIX: If query is empty, return 5 hospital recommendations initially
        // If query exists, search for hospitals matching the name
        const sqlQuery = query && query.trim() !== ''
            ? `SELECT id, full_name, COALESCE(photo_url, '') AS photo_url 
               FROM users 
               WHERE role = 'hospital' AND full_name ILIKE $1 
               LIMIT 10`
            : `SELECT id, full_name, COALESCE(photo_url, '') AS photo_url 
               FROM users 
               WHERE role = 'hospital' 
               LIMIT 5`;

        const params = query && query.trim() !== '' ? [`%${query}%`] : [];
        const result = await pool.query(sqlQuery, params);
        
        res.json({ success: true, contacts: result.rows });
    } catch (err) {
        console.error("❌ Search Contacts Error:", err.message);
        res.status(500).json({ success: false, message: "Error searching hospitals" });
    }
};

// 📂 2. Get all existing conversations (Includes hospital names and photos)
exports.getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Added COALESCE to handle the missing photo_url column gracefully
        // Also aliased full_name as hospital_name to match your frontend expectations
        const result = await pool.query(
            `SELECT DISTINCT ON (other_user_id) 
                CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END AS other_user_id,
                u.full_name AS hospital_name, 
                COALESCE(u.photo_url, '') AS photo_url, 
                m.message_text, m.created_at
             FROM messages m
             JOIN users u ON u.id = (CASE WHEN m.sender_id = $1 THEN m.receiver_id ELSE m.sender_id END)
             WHERE m.sender_id = $1 OR m.receiver_id = $1 
             ORDER BY other_user_id, m.created_at DESC`,
            [userId]
        );
        res.json({ success: true, conversations: result.rows });
    } catch (err) {
        console.error("❌ Fetch Conversations Error:", err.message);
        res.status(500).json({ success: false, message: "Error fetching conversations" });
    }
};

// 📂 3. Get full chat history with a specific person
exports.getChatHistory = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT * FROM messages 
             WHERE (sender_id = $1 AND receiver_id = $2) 
                OR (sender_id = $2 AND receiver_id = $1) 
             ORDER BY created_at ASC`,
            [userId, otherUserId]
        );
        res.json({ success: true, messages: result.rows });
    } catch (err) {
        console.error("❌ Fetch History Error:", err.message);
        res.status(500).json({ success: false, message: "Error fetching chat history" });
    }
};

// ➕ 4. Send a new message (Manual ID Workaround Included)
exports.sendMessage = async (req, res) => {
    try {
        const { receiver_id, message_text } = req.body;
        
        // Validation
        if (!receiver_id || !message_text) {
            return res.status(400).json({ success: false, message: "Missing receiver or message text" });
        }

        // 🛠️ WORKAROUND: Manually calculate next ID to bypass sequence permission issues
        const idResult = await pool.query("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM messages");
        const nextId = idResult.rows[0].next_id;

        const newMessage = await pool.query(
            `INSERT INTO messages (id, sender_id, receiver_id, message_text) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [nextId, req.user.id, receiver_id, message_text]
        );
        
        res.status(201).json({ success: true, message: newMessage.rows[0] });
    } catch (err) {
        console.error("❌ Send Message Error:", err.message);
        res.status(500).json({ success: false, message: "Failed to send message" });
    }
};