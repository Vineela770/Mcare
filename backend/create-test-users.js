const pool = require('./config/db');
const bcrypt = require('bcrypt');

async function createTestUsers() {
  try {
    console.log("🔄 Creating test users...");

    // Create test employer/HR user
    const hrPassword = await bcrypt.hash('TestHR123!', 12);
    const hrResult = await pool.query(
      `INSERT INTO users (title, full_name, email, password, phone_number, location, role, is_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       ON CONFLICT (email) DO UPDATE SET
       password = EXCLUDED.password,
       is_verified = EXCLUDED.is_verified
       RETURNING id, email, role`,
      ['Ms.', 'Sarah Williams', 'hr@test.com', hrPassword, '+91-9876543210', 'Mumbai, Maharashtra', 'hr', true]
    );

    // Create employer profile for the HR user
    await pool.query(
      `INSERT INTO employer_profiles 
       (user_id, designation, organization_name, organization_category, number_of_beds, organization_city, organization_address) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id) DO UPDATE SET
       designation = EXCLUDED.designation,
       organization_name = EXCLUDED.organization_name
       `,
      [hrResult.rows[0].id, 'HR Manager', 'Apollo Hospitals', 'Multi-Specialty Hospital', '500', 'Mumbai', 'Sector 26, Mumbai']
    );

    console.log(`✅ Created HR user: hr@test.com (ID: ${hrResult.rows[0].id})`);

    // Create test candidate user
    const candidatePassword = await bcrypt.hash('TestCandidate123!', 12);
    const candidateResult = await pool.query(
      `INSERT INTO users (title, full_name, email, password, phone_number, location, role, is_verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       ON CONFLICT (email) DO UPDATE SET
       password = EXCLUDED.password,
       is_verified = EXCLUDED.is_verified
       RETURNING id, email, role`,
      ['Dr.', 'John Smith', 'doctor@test.com', candidatePassword, '+91-9876543211', 'Delhi, NCR', 'candidate', true]
    );

    // Create candidate profile
    await pool.query(
      `INSERT INTO candidate_profiles (user_id, qualification) 
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET
       qualification = EXCLUDED.qualification`,
      [candidateResult.rows[0].id, 'MBBS, MD - General Medicine']
    );

    console.log(`✅ Created Candidate user: doctor@test.com (ID: ${candidateResult.rows[0].id})`);

    console.log('\n🎉 Test users created successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('Employer Login:');
    console.log('  Email: hr@test.com');
    console.log('  Password: TestHR123!');
    console.log('');
    console.log('Candidate Login:');
    console.log('  Email: doctor@test.com');
    console.log('  Password: TestCandidate123!');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test users:", error);
    process.exit(1);
  }
}

createTestUsers();