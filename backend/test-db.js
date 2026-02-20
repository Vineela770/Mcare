const { Pool } = require("pg");

console.log("🔍 Checking environment...");

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is not defined!");
  process.exit(1);
}

console.log("✅ DATABASE_URL found");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => {
    console.log("✅ Database Connected Successfully!");
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed:");
    console.error(err.message);
  });

module.exports = pool;
