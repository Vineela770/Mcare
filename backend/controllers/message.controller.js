const pool = require("../config/db");

// 🔍 1. Search Hospitals (Updated to show recommendations when empty)
// This allows users to find hospitals and start new conversations
exports.searchContacts = async (req, res) => {
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