const pool = require("./config/db");

// Each statement run individually so existing tables/indexes are skipped gracefully
const SCHEMA_STATEMENTS = [

  // ── Users ──────────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS users (
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
  )`,
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  `CREATE INDEX IF NOT EXISTS idx_users_role  ON users(role)`,

  // ── Candidate Profiles ─────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS candidate_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    qualification VARCHAR(255),
    resume_url TEXT,
    professional_summary TEXT,
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
    experience TEXT,
    work_experience TEXT,
    education TEXT,
    skills TEXT,
    certifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_candidate_user_id ON candidate_profiles(user_id)`,

  // ── Employer Profiles ──────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS employer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    designation VARCHAR(255),
    organization_name VARCHAR(255),
    organization_category VARCHAR(255),
    number_of_beds VARCHAR(50),
    organization_city VARCHAR(255),
    organization_address TEXT,
    website_url VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_employer_user_id ON employer_profiles(user_id)`,

  // ── Jobs ───────────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS jobs (
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
  )`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_is_active  ON jobs(is_active)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_location   ON jobs(location)`,

  // ── Applications ───────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS applications (
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
  )`,
  `CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id)`,
  `CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status)`,

  // ── Saved Jobs ─────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS saved_jobs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id  ON saved_jobs(job_id)`,

  // ── Job Alerts ─────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS job_alerts (
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
  )`,
  `CREATE INDEX IF NOT EXISTS idx_job_alerts_user_id  ON job_alerts(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_job_alerts_is_active ON job_alerts(is_active)`,

  // ── Messages ───────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_messages_sender_id   ON messages(sender_id)`,
  `CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id)`,

  // ── Follow Employers ───────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS follow_employers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, employer_id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_follow_user_id     ON follow_employers(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_follow_employer_id ON follow_employers(employer_id)`,

  // ── Password Reset Tokens ──────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_password_reset_token   ON password_reset_tokens(token)`,
  `CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset_tokens(user_id)`,

  // ── Guest Applications ─────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS guest_applications (
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
  )`,
  `CREATE INDEX IF NOT EXISTS idx_guest_applications_status ON guest_applications(status)`,

  // ── System Settings ──────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_name VARCHAR(255) DEFAULT 'MCARE',
    site_description TEXT DEFAULT 'Healthcare Jobs Platform',
    contact_email VARCHAR(255) DEFAULT 'admin@mcare.com',
    support_email VARCHAR(255) DEFAULT 'support@mcare.com',
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    push_notifications BOOLEAN DEFAULT TRUE,
    two_factor_auth BOOLEAN DEFAULT FALSE,
    session_timeout INTEGER DEFAULT 30,
    password_expiry INTEGER DEFAULT 90,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    debug_mode BOOLEAN DEFAULT FALSE,
    auto_backup BOOLEAN DEFAULT TRUE,
    backup_frequency VARCHAR(50) DEFAULT 'daily',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `INSERT INTO system_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`,

  // ── Activity Logs ──────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(50),
    user_role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id    ON activity_logs(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_activity_logs_action     ON activity_logs(action)`,
  `CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at)`,

  // ── Guest Jobs ─────────────────────────────────────────────────────────────
  `CREATE TABLE IF NOT EXISTS guest_jobs (
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
  )`,
  `CREATE INDEX IF NOT EXISTS idx_guest_jobs_status ON guest_jobs(status)`,

  // ── updated_at trigger function ────────────────────────────────────────────
  `CREATE OR REPLACE FUNCTION update_updated_at_column()
   RETURNS TRIGGER AS $$
   BEGIN
     NEW.updated_at = NOW();
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql`,

  // Triggers (DROP IF EXISTS first so CREATE succeeds on re-run)
  `DROP TRIGGER IF EXISTS update_users_timestamp ON users`,
  `CREATE TRIGGER update_users_timestamp
     BEFORE UPDATE ON users
     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,

  `DROP TRIGGER IF EXISTS update_candidate_profiles_timestamp ON candidate_profiles`,
  `CREATE TRIGGER update_candidate_profiles_timestamp
     BEFORE UPDATE ON candidate_profiles
     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,

  `DROP TRIGGER IF EXISTS update_employer_profiles_timestamp ON employer_profiles`,
  `CREATE TRIGGER update_employer_profiles_timestamp
     BEFORE UPDATE ON employer_profiles
     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,

  `DROP TRIGGER IF EXISTS update_jobs_timestamp ON jobs`,
  `CREATE TRIGGER update_jobs_timestamp
     BEFORE UPDATE ON jobs
     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,

  `DROP TRIGGER IF EXISTS update_applications_timestamp ON applications`,
  `CREATE TRIGGER update_applications_timestamp
     BEFORE UPDATE ON applications
     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,

  `DROP TRIGGER IF EXISTS update_job_alerts_timestamp ON job_alerts`,
  `CREATE TRIGGER update_job_alerts_timestamp
     BEFORE UPDATE ON job_alerts
     FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
];

async function runMigration() {
  let successCount = 0;
  let skipCount = 0;

  try {
    console.log("🔧 Running safe (non-destructive) database migration...");

    for (const sql of SCHEMA_STATEMENTS) {
      try {
        await pool.query(sql);
        successCount++;
      } catch (err) {
        // 42P07 = duplicate table, 42P16 = duplicate trigger, 42710 = duplicate index
        if (['42P07', '42P16', '42710', '42701'].includes(err.code)) {
          skipCount++;
        } else {
          console.warn(`⚠️  Skipping statement (${err.code}): ${err.message}`);
          skipCount++;
        }
      }
    }

    console.log(`✅ Migration done — ${successCount} executed, ${skipCount} already existed`);

    const result = await pool.query("SELECT COUNT(*) FROM users");
    console.log(`👥 Users in database: ${result.rows[0].count}`);

    return true;
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    if (require.main === module) process.exit(1);
    return false;
  }
}

if (require.main === module) {
  runMigration().then(() => process.exit(0));
}

module.exports = runMigration;
