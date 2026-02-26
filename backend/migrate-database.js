const pool = require("./config/db");
const fs = require("fs");
const path = require("path");

async function runMigration() {
  try {
    console.log("🔄 Checking database schema...");

    // Check if tables already exist
    const tableCheck = await pool.query(`
      SELECT COUNT(*) 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `);

    if (tableCheck.rows[0].count > 0) {
      console.log("✅ Database tables already exist");
      const result = await pool.query("SELECT COUNT(*) FROM users");
      console.log(`👥 Users table ready (${result.rows[0].count} users)`);
      return true;
    }

    console.log("🔄 Creating database tables...");

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

    return true;
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(error);
    
    // Don't exit process if running from server
    if (require.main === module) {
      process.exit(1);
    }
    return false;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration().then(() => process.exit(0));
}

module.exports = runMigration;
