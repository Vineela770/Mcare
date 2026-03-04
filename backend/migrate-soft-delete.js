const pool = require('./config/db');

async function migrate() {
  try {
    // Check existing columns
    const result = await pool.query(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name IN ('is_deleted', 'deleted_at')"
    );
    const cols = result.rows.map(r => r.column_name);

    if (!cols.includes('is_deleted')) {
      await pool.query('ALTER TABLE users ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE');
      console.log('Added is_deleted column');
    } else {
      console.log('is_deleted already exists');
    }

    if (!cols.includes('deleted_at')) {
      await pool.query('ALTER TABLE users ADD COLUMN deleted_at TIMESTAMP');
      console.log('Added deleted_at column');
    } else {
      console.log('deleted_at already exists');
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

migrate();
