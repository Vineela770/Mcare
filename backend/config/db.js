const { Pool } = require("pg");

let pool;

console.log("🔍 NODE_ENV:", process.env.NODE_ENV);

// ✅ PRODUCTION (Render / Supabase)
if (process.env.NODE_ENV === "production") {
  console.log("🌍 Using Production Database (DATABASE_URL)");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not defined!");
    process.exit(1);
  }

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

} else {
  // ✅ DEVELOPMENT (Local PostgreSQL)
  console.log("💻 Using Local Database");

  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
}

module.exports = pool;
