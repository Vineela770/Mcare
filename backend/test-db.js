const { Pool } = require("pg");

// In production (Render), use DATABASE_URL
// In local development, you can still use local .env values if needed

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

// Test connection once when server starts
pool.connect()
  .then(client => {
    console.log("✅ Database connected successfully!");
    client.release();
  })
  .catch(err => {
    console.error("❌ Database connection failed!");
    console.error("Details:", err.message);
  });

module.exports = pool;
