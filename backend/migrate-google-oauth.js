const pool = require('./config/db');

/**
 * Migration: Add Google OAuth support to users table
 * Adds: google_id, profile_photo, email_verified columns
 */

async function addGoogleOAuthColumns() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting Google OAuth migration...');
    
    await client.query('BEGIN');
    
    // Add google_id column if it doesn't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE
    `);
    console.log('✅ Added google_id column');
    
    // Add profile_photo column if it doesn't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS profile_photo TEXT
    `);
    console.log('✅ Added profile_photo column');
    
    // Add email_verified column if it doesn't exist
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false
    `);
    console.log('✅ Added email_verified column');
    
    await client.query('COMMIT');
    
    console.log('🎉 Google OAuth migration completed successfully!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
addGoogleOAuthColumns()
  .then(() => {
    console.log('✅ Migration script finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Migration script failed:', err);
    process.exit(1);
  });
