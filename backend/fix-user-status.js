const pool = require('./config/db');
const fs = require('fs');

async function fixUserStatus() {
  try {
    console.log('🔧 Fixing user status in database...');
    
    // Update all users who have successfully registered to be verified/active
    const updateResult = await pool.query(`
      UPDATE users 
      SET is_verified = TRUE, updated_at = NOW()
      WHERE is_verified = FALSE
        AND password IS NOT NULL 
        AND password != 'admin_created'
        AND email IS NOT NULL
    `);
    
    console.log('✅ Update completed, rows affected:', updateResult.rowCount);
    
    // Show count
    const countResult = await pool.query('SELECT COUNT(*) as total_active FROM users WHERE is_verified = TRUE');
    console.log('📊 Total active users now:', countResult.rows[0].total_active);
    
    // Show users with their status
    const usersResult = await pool.query(`
      SELECT id, full_name, email, role, is_verified,
             CASE WHEN is_verified THEN 'Active' ELSE 'Inactive' END as status
      FROM users 
      ORDER BY created_at DESC
      LIMIT 10
    `);
    
    console.log('👥 Recent users status:');
    usersResult.rows.forEach(user => {
      console.log(`  ${user.full_name} (${user.email}) - ${user.status}`);
    });
    
    console.log('🎉 User status fix completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error fixing user status:', err.message);
    process.exit(1);
  }
}

fixUserStatus();