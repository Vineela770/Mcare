const pool = require("../config/db");

// 📂 1. Fetch all alerts for the logged-in user
exports.getMyAlerts = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM job_alerts WHERE user_id = $1 ORDER BY created_at DESC",
            [req.user.id]
        );
        res.json({ success: true, alerts: result.rows });
    } catch (err) {
        console.error("❌ Fetch Alerts Error:", err);
        res.status(500).json({ success: false, message: "Error fetching alerts" });
    }
};

// ➕ 2. Create a new job alert (Manual ID Workaround)
exports.createAlert = async (req, res) => {
    try {
        // Destructure keys matching the payload sent by the frontend
        const { title, keywords, location, jobType, frequency } = req.body;
        
        // Mandatory field validation
        if (!title || !keywords || !location) {
            return res.status(400).json({ success: false, message: "Missing mandatory fields" });
        }

        // 🛠️ WORKAROUND: Manually calculate next ID to bypass "permission denied for sequence"
        const idResult = await pool.query("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM job_alerts");
        const nextId = idResult.rows[0].next_id;

        // Map React keys (keywords, jobType) to DB columns (keyword, job_type)
        // Use the manual nextId to avoid calling the restricted sequence
        const newAlert = await pool.query(
            `INSERT INTO job_alerts (id, user_id, title, keyword, location, job_type, frequency, is_active)
             VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *`,
            [nextId, req.user.id, title, keywords, location, jobType, frequency]
        );
        res.status(201).json({ success: true, alert: newAlert.rows[0] });
    } catch (err) {
        console.error("❌ Save Alert Error:", err.message);
        res.status(500).json({ success: false, message: "Error saving alert" });
    }
};

// 🔄 3. Update an existing alert
exports.updateAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, keywords, location, jobType, frequency } = req.body;

        const result = await pool.query(
            `UPDATE job_alerts 
             SET title = $1, keyword = $2, location = $3, job_type = $4, frequency = $5 
             WHERE id = $6 AND user_id = $7 RETURNING *`,
            [title, keywords, location, jobType, frequency, id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Alert not found" });
        }

        res.json({ success: true, alert: result.rows[0] });
    } catch (err) {
        console.error("❌ Update Alert Error:", err);
        res.status(500).json({ success: false, message: "Error updating alert" });
    }
};

// 🔘 4. Toggle Alert Status (Active/Inactive)
exports.toggleAlertStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;

        const result = await pool.query(
            "UPDATE job_alerts SET is_active = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
            [is_active, id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Alert not found" });
        }

        res.json({ success: true, is_active: result.rows[0].is_active, alert: result.rows[0] });
    } catch (err) {
        console.error("❌ Toggle Status Error:", err);
        res.status(500).json({ success: false, message: "Error toggling status" });
    }
};

// 🗑️ 5. Delete an alert
exports.deleteAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM job_alerts WHERE id = $1 AND user_id = $2",
            [id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: "Alert not found" });
        }

        res.json({ success: true, message: "Alert deleted successfully" });
    } catch (err) {
        console.error("❌ Delete Alert Error:", err);
        res.status(500).json({ success: false, message: "Error deleting alert" });
    }
};