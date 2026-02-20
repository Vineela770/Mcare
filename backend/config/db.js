const { Pool } = require("pg");
require("dotenv").config();

// Initialize the connection pool using .env variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  // Added: suggested pool limits for better performance
  max: 20, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle unexpected errors on idle clients to prevent server crashes
pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client:', err.message);
  process.exit(-1);
});

/**
 * 🐘 Test Database Connection
 * Using an async self-invoking function to verify the connection 
 * before the server starts processing requests.
 */
(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`🐘 PostgreSQL Connected Successfully at: ${res.rows[0].now}`);
  } catch (err) {
    console.error("❌ DB Connection Error:", err.message);
    console.log("⚠️ Please check if your PostgreSQL service is running and .env credentials are correct.");
  }
})();

module.exports = pool;