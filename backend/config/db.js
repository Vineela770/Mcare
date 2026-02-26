const { Pool } = require("pg");

let pool;

console.log("🔍 NODE_ENV:", process.env.NODE_ENV);
console.log("🔍 DATABASE_URL exists:", !!process.env.DATABASE_URL);

// ✅ Check if we're in production (Render provides DATABASE_URL)
const isProduction = process.env.NODE_ENV === "production" || process.env.DATABASE_URL;

if (isProduction) {
  console.log("🌍 Using Production Database (DATABASE_URL)");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not defined!");
    process.exit(1);
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for Render, Railway, Heroku databases
    },
  });

} else {
  // ✅ DEVELOPMENT (Local PostgreSQL)
  console.log("💻 Using Local Database");

  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}

// Add connection event listeners for better debugging
pool.on('connect', () => {
  console.log('🐘 PostgreSQL Connected Successfully at:', new Date().toLocaleString());
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
});

module.exports = pool;
