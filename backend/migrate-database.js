const pool = require("./config/db");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  try {
    console.log("🔄 Starting database migration...");

    // Read the SQL file
    const sqlPath = path.join(__dirname, "database-schema.sql");
    const sql = fs.readFileSync(sqlPath, "utf8");

    // Execute the SQL
    await pool.query(sql);

    console.log("✅ Database migration completed successfully!");
    console.log("📊 All tables, indexes, and triggers have been created");
    
    // Test the connection
    const result = await pool.query("SELECT COUNT(*) FROM users");
    console.log(`👥 Users table ready (${result.rows[0].count} users)`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = runMigration;
