const pool = require("../../config/db");
const { Parser } = require("json2csv");
const fs = require("fs");
const path = require("path");

// GET DASHBOARD REPORT STATS
exports.getReportStats = async (req, res) => {
  try {

    const totalReports = await pool.query(
      "SELECT COUNT(*) FROM reports"
    );

    const thisMonth = await pool.query(
      "SELECT COUNT(*) FROM reports WHERE DATE_TRUNC('month', generated_at) = DATE_TRUNC('month', CURRENT_DATE)"
    );

    const totalDownloads = await pool.query(
      "SELECT COUNT(*) FROM reports"
    );

    const scheduled = await pool.query(
      "SELECT COUNT(*) FROM scheduled_reports WHERE status='Active'"
    );

    const scheduledReports = await pool.query(
      "SELECT * FROM scheduled_reports"
    );

    res.json({
      totalReports: totalReports.rows[0].count,
      thisMonth: thisMonth.rows[0].count,
      totalDownloads: totalDownloads.rows[0].count,
      scheduled: scheduled.rows[0].count,
      scheduledReports: scheduledReports.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


// GENERATE USER REPORT
exports.generateUserReport = async (req, res) => {
  try {

    const { from, to } = req.body;

    const users = await pool.query(
      "SELECT id, name, email, role FROM users WHERE joined BETWEEN $1 AND $2",
      [from, to]
    );

    const parser = new Parser();
    const csv = parser.parse(users.rows);

    const fileName = `user_report_${Date.now()}.csv`;
    const filePath = path.join(__dirname, "../reports", fileName);

    fs.writeFileSync(filePath, csv);

    await pool.query(
      "INSERT INTO reports (title, type, file_path, file_size) VALUES ($1,$2,$3,$4)",
      ["User Analytics Report", "users", fileName, `${csv.length} bytes`]
    );

    res.json({ message: "Report Generated", fileName });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Generation Failed" });
  }
};
