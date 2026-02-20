const path = require('path');
require("dotenv").config({ path: path.join(__dirname, '.env') });
const { Pool } = require("pg");

console.log("🔍 Checking .env loading...");
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);

if (!process.env.DB_PASSWORD) {
  console.error("❌ ERROR: DB_PASSWORD is not defined in .env");
  process.exit(1);
}

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // Ensures password is a string
  port: process.env.DB_PORT || 5432,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("❌ Database connection failed!");
    console.error("Details:", err.message);
  } else {
    console.log("✅ Connection Successful!");
    console.log("Database Server Time:", res.rows[0].now);
  }
  pool.end();
});