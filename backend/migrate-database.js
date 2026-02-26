const pool = require("./config/db");

// Database schema SQL embedded directly
const DATABASE_SCHEMA = `
-- Drop tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS password_reset_tokens CASCADE;
DROP TABLE IF EXISTS job_alerts CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS follow_employers CASCADE;
DROP TABLE IF EXISTS guest_applications CASCADE;
DROP TABLE IF EXISTS guest_jobs CASCADE;
DROP TABLE IF EXISTS candidate_profiles CASCADE;
DROP TABLE IF EXISTS employer_profiles CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(50),
  location VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('candidate', 'employer', 'hr', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  profile_photo_url TEXT,
  profile_views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Candidate Profiles
CREATE TABLE candidate_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  qualification VARCHAR(255),
  resume_url TEXT,
  dob DATE,
  gender VARCHAR(20),
  highest_qualification VARCHAR(255),
  current_experience VARCHAR(100),
  current_position VARCHAR(255),
  preferred_job_type VARCHAR(100),
  preferred_location VARCHAR(255),
  expected_salary VARCHAR(100),
  willing_to_relocate BOOLEAN DEFAULT FALSE,
  interested_in_teaching BOOLEAN DEFAULT FALSE,
  work_experience TEXT,
  education TEXT,
  skills TEXT,
  certifications TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_candidate_user_id ON candidate_profiles(user_id);

-- Employer Profiles
CREATE TABLE employer_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  designation VARCHAR(255),
  organization_name VARCHAR(255) NOT NULL,
  organization_category VARCHAR(255),
  number_of_beds VARCHAR(50),
  organization_city VARCHAR(255),
  organization_address TEXT,
  website_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_employer_user_id ON employer_profiles(user_id);

-- Jobs
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  employer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  location VARCHAR(255),
  city VARCHAR(255),
  job_type VARCHAR(50) DEFAULT 'Full-time',
  min_salary VARCHAR(50),
  max_salary VARCHAR(50),
  salary_period VARCHAR(50),
  description TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX idx_jobs_is_active ON jobs(is_active);
CREATE INDEX idx_jobs_location ON jobs(location);

-- Applications
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter_path TEXT,
  resume_url TEXT,
  availability VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Under Review',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, user_id)
);

CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Saved Jobs
CREATE TABLE saved_jobs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, job_id)
);

CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);

-- Job Alerts
CREATE TABLE job_alerts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  keywords TEXT,
  location VARCHAR(255),
  job_type VARCHAR(50),
  frequency VARCHAR(50) DEFAULT 'Daily',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_job_alerts_user_id ON job_alerts(user_id);
CREATE INDEX idx_job_alerts_is_active ON job_alerts(is_active);

-- Messages
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);

-- Follow Employers
CREATE TABLE follow_employers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  employer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, employer_id)
);

CREATE INDEX idx_follow_user_id ON follow_employers(user_id);
CREATE INDEX idx_follow_employer_id ON follow_employers(employer_id);

-- Password Reset Tokens
CREATE TABLE password_reset_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_user_id ON password_reset_tokens(user_id);

-- Guest Applications
CREATE TABLE guest_applications (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  country_code VARCHAR(10) DEFAULT '+91',
  cover_letter TEXT NOT NULL,
  resume_url TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_guest_applications_status ON guest_applications(status);

-- Guest Jobs
CREATE TABLE guest_jobs (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  country_code VARCHAR(10) DEFAULT '+91',
  job_title VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  job_description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending Review',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_guest_jobs_status ON guest_jobs(status);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidate_profiles_timestamp
BEFORE UPDATE ON candidate_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employer_profiles_timestamp
BEFORE UPDATE ON employer_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_timestamp
BEFORE UPDATE ON jobs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_timestamp
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_alerts_timestamp
BEFORE UPDATE ON job_alerts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;

async function runMigration() {
  try {
    console.log("🔄 Checking database schema...");

    // Check if tables already exist
    const tableCheck = await pool.query(`
      SELECT COUNT(*) 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `);

    if (tableCheck.rows[0].count > 0) {
      console.log("✅ Database tables already exist");
      const result = await pool.query("SELECT COUNT(*) FROM users");
      console.log(`👥 Users table ready (${result.rows[0].count} users)`);
      return true;
    }

    console.log("🔄 Creating database tables...");

    // Execute the SQL
    await pool.query(DATABASE_SCHEMA);

    console.log("✅ Database migration completed successfully!");
    console.log("📊 All tables, indexes, and triggers have been created");
    
    // Test the connection
    const result = await pool.query("SELECT COUNT(*) FROM users");
    console.log(`👥 Users table ready (${result.rows[0].count} users)`);

    return true;
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error(error);
    
    // Don't exit process if running from server
    if (require.main === module) {
      process.exit(1);
    }
    return false;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration().then(() => process.exit(0));
}

module.exports = runMigration;
