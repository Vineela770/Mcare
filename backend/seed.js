/**
 * MCARE Healthcare Portal – Database Seed Script
 * Run with:  node seed.js
 *
 * Adds realistic dummy data to all tables:
 *   users, candidate_profiles, employer_profiles, jobs,
 *   mcare_job_posts, applications, saved_jobs, job_alerts,
 *   messages, activity_logs, guest_applications, guest_jobs
 *
 * Safe to re-run – uses ON CONFLICT DO NOTHING for emails.
 */

if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const bcrypt = require('bcryptjs');
const pool   = require('./config/db');

// ─────────────────────────────────────────────
// 1. SHARED PASSWORD HASH (Password@123)
// ─────────────────────────────────────────────
const HASH = bcrypt.hashSync('Password@123', 10);

// ─────────────────────────────────────────────
// 2. USERS
// ─────────────────────────────────────────────
const USERS = [
  // Admin
  { title:'Mr',  full_name:'Admin User',       email:'admin@mcare.com',         role:'admin',     phone:'+919100000001' },
  // HR / Employers
  { title:'Dr',  full_name:'Rajesh Kumar',     email:'hr1@apollohospitals.com', role:'hr',        phone:'+919100000010' },
  { title:'Ms',  full_name:'Priya Sharma',     email:'hr2@fortishealthcare.com',role:'hr',        phone:'+919100000011' },
  { title:'Mr',  full_name:'Arun Mehta',       email:'hr3@manipalhospitals.com',role:'hr',        phone:'+919100000012' },
  { title:'Ms',  full_name:'Sunita Reddy',     email:'hr4@aiims.edu',           role:'hr',        phone:'+919100000013' },
  // Candidates (Doctors)
  { title:'Dr',  full_name:'Vineela Reddy',    email:'vineela@gmail.com',       role:'candidate', phone:'+919876543210' },
  { title:'Dr',  full_name:'Arjun Patel',      email:'arjun.patel@gmail.com',   role:'candidate', phone:'+919876543211' },
  { title:'Dr',  full_name:'Meena Krishnan',   email:'meena.k@gmail.com',       role:'candidate', phone:'+919876543212' },
  { title:'Dr',  full_name:'Sanjay Gupta',     email:'sanjay.g@gmail.com',      role:'candidate', phone:'+919876543213' },
  { title:'Dr',  full_name:'Ananya Singh',     email:'ananya.s@gmail.com',      role:'candidate', phone:'+919876543214' },
  { title:'Dr',  full_name:'Rahul Desai',      email:'rahul.d@gmail.com',       role:'candidate', phone:'+919876543215' },
];

// ─────────────────────────────────────────────
// 3. EMPLOYER PROFILES  (keyed by email)
// ─────────────────────────────────────────────
const EMPLOYER_PROFILES = {
  'hr1@apollohospitals.com':  { organization_name:'Apollo Hospitals',       organization_category:'Multi-Specialty', number_of_beds:'550', organization_city:'Hyderabad',  organization_address:'Jubilee Hills, Road No 72, Hyderabad 500033', website_url:'https://apollohospitals.com' },
  'hr2@fortishealthcare.com': { organization_name:'Fortis Healthcare',      organization_category:'Tertiary Care',   number_of_beds:'400', organization_city:'Bangalore',  organization_address:'Bannerghatta Road, Bangalore 560076',         website_url:'https://fortishealthcare.com' },
  'hr3@manipalhospitals.com': { organization_name:'Manipal Hospitals',      organization_category:'Multi-Specialty', number_of_beds:'600', organization_city:'Hyderabad',  organization_address:'Banjara Hills, Road No 12, Hyderabad',        website_url:'https://manipalhospitals.com' },
  'hr4@aiims.edu':            { organization_name:'AIIMS Hyderabad',        organization_category:'Government',      number_of_beds:'1200',organization_city:'Hyderabad',  organization_address:'Bibinagar, Hyderabad 508126',                 website_url:'https://aiimshyd.edu.in' },
};

// ─────────────────────────────────────────────
// 4. CANDIDATE PROFILES  (keyed by email)
// ─────────────────────────────────────────────
const CANDIDATE_PROFILES = {
  'vineela@gmail.com':       { qualification:'MBBS, MD (General Medicine)', current_position:'General Physician', current_experience:'3 Years', preferred_job_type:'Full-time', preferred_location:'Hyderabad', expected_salary:'₹15,00,000 – ₹20,00,000', skills:'Patient Care, Diagnosis, ECG Interpretation, Emergency Medicine', gender:'Female' },
  'arjun.patel@gmail.com':   { qualification:'MBBS, MS (Orthopaedics)',     current_position:'Orthopaedic Surgeon', current_experience:'6 Years', preferred_job_type:'Full-time', preferred_location:'Bangalore', expected_salary:'₹25,00,000 – ₹35,00,000', skills:'Joint Replacement, Arthroscopy, Trauma Surgery, Spine Surgery', gender:'Male' },
  'meena.k@gmail.com':       { qualification:'MBBS, MD (Paediatrics)',      current_position:'Paediatrician',       current_experience:'5 Years', preferred_job_type:'Full-time', preferred_location:'Chennai',   expected_salary:'₹18,00,000 – ₹24,00,000', skills:'Neonatology, Child Nutrition, Vaccination, Developmental Paediatrics', gender:'Female' },
  'sanjay.g@gmail.com':      { qualification:'MBBS, MCh (Neurosurgery)',    current_position:'Neurosurgeon',        current_experience:'9 Years', preferred_job_type:'Full-time', preferred_location:'Hyderabad', expected_salary:'₹40,00,000 – ₹60,00,000', skills:'Brain Tumour Surgery, DBS, Spinal Surgery, Epilepsy Management', gender:'Male' },
  'ananya.s@gmail.com':      { qualification:'MBBS, MD (Radiology)',        current_position:'Radiologist',         current_experience:'4 Years', preferred_job_type:'Full-time', preferred_location:'Mumbai',    expected_salary:'₹20,00,000 – ₹28,00,000', skills:'CT Scan Interpretation, MRI, USG, Interventional Radiology', gender:'Female' },
  'rahul.d@gmail.com':       { qualification:'MBBS, DM (Cardiology)',       current_position:'Cardiologist',        current_experience:'7 Years', preferred_job_type:'Full-time', preferred_location:'Hyderabad', expected_salary:'₹35,00,000 – ₹50,00,000', skills:'Echocardiography, Angioplasty, Pacemaker Implantation, Heart Failure Management', gender:'Male' },
};

// ─────────────────────────────────────────────
// 5. JOBS (employer-posted, from jobs table)
// ─────────────────────────────────────────────
// We'll look up employer_id dynamically after inserting users
const JOB_TEMPLATES = [
  {
    hr_email: 'hr1@apollohospitals.com',
    title: 'Senior Cardiologist', company_name: 'Apollo Hospitals',
    category: 'Cardiology', location: 'Hyderabad', city: 'Hyderabad',
    job_type: 'Full-time', min_salary: '₹35,00,000', max_salary: '₹55,00,000',
    description: 'Apollo Hospitals is seeking an experienced Senior Cardiologist to lead our Cardiac Sciences department. The candidate will manage complex cardiac cases, supervise junior doctors, and contribute to research programmes.\n\nYou will work in a state-of-the-art cath lab equipped with the latest interventional cardiology tools.',
    requirements: 'MBBS + DM/DNB Cardiology\nMinimum 5 years post-DM experience\nProven experience in interventional procedures\nStrong leadership and communication skills',
    is_active: true,
  },
  {
    hr_email: 'hr1@apollohospitals.com',
    title: 'General Surgeon', company_name: 'Apollo Hospitals',
    category: 'Surgery', location: 'Hyderabad', city: 'Hyderabad',
    job_type: 'Full-time', min_salary: '₹20,00,000', max_salary: '₹30,00,000',
    description: 'We are looking for a skilled General Surgeon to join our surgical team at Apollo Hospitals Hyderabad. You will perform elective and emergency surgeries and mentor post-graduate residents.',
    requirements: 'MBBS + MS/DNB General Surgery\n3+ years experience post-MS\nExperience in laparoscopic surgery preferred\nAbility to work in emergency settings',
    is_active: true,
  },
  {
    hr_email: 'hr2@fortishealthcare.com',
    title: 'Paediatric Consultant', company_name: 'Fortis Healthcare',
    category: 'Paediatrics', location: 'Bangalore', city: 'Bangalore',
    job_type: 'Full-time', min_salary: '₹18,00,000', max_salary: '₹26,00,000',
    description: 'Fortis Healthcare Bangalore invites applications from qualified Paediatricians for our well-established Paediatrics department. The role includes managing inpatient and outpatient paediatric cases.',
    requirements: 'MBBS + MD/DNB Paediatrics\n3+ years of clinical experience\nNeonatology experience preferred\nExcellent patient communication skills',
    is_active: true,
  },
  {
    hr_email: 'hr2@fortishealthcare.com',
    title: 'Orthopaedic Surgeon', company_name: 'Fortis Healthcare',
    category: 'Orthopaedics', location: 'Bangalore', city: 'Bangalore',
    job_type: 'Full-time', min_salary: '₹28,00,000', max_salary: '₹40,00,000',
    description: 'We are hiring an Orthopaedic Surgeon with expertise in joint replacement and sports medicine to strengthen our Orthopaedics team at Fortis Bannerghatta, Bangalore.',
    requirements: 'MBBS + MS/DNB Orthopaedics\n5+ years post-residency experience\nJoint replacement/arthroscopy expertise\nWillingness to take on-call duty',
    is_active: true,
  },
  {
    hr_email: 'hr3@manipalhospitals.com',
    title: 'Neurosurgeon', company_name: 'Manipal Hospitals',
    category: 'Neurosurgery', location: 'Hyderabad', city: 'Hyderabad',
    job_type: 'Full-time', min_salary: '₹45,00,000', max_salary: '₹70,00,000',
    description: 'Manipal Hospitals Hyderabad is looking for an accomplished Neurosurgeon to lead complex brain and spine surgical programmes. You will collaborate with the neurology and oncology teams.',
    requirements: 'MBBS + MCh/DNB Neurosurgery\n7+ years post-MCh experience\nExpertise in brain tumour and spine surgery\nResearch publications preferred',
    is_active: true,
  },
  {
    hr_email: 'hr3@manipalhospitals.com',
    title: 'Radiologist', company_name: 'Manipal Hospitals',
    category: 'Radiology', location: 'Hyderabad', city: 'Hyderabad',
    job_type: 'Full-time', min_salary: '₹22,00,000', max_salary: '₹32,00,000',
    description: 'We require an experienced Radiologist to head our imaging department. You will interpret CT, MRI, USG and PET scans and provide expert diagnostic reports.',
    requirements: 'MBBS + MD/DNB Radiology\n3+ years clinical experience\nFamiliarity with PACS systems\nInterventional Radiology skills are a plus',
    is_active: true,
  },
  {
    hr_email: 'hr4@aiims.edu',
    title: 'Junior Resident – General Medicine', company_name: 'AIIMS Hyderabad',
    category: 'General Medicine', location: 'Hyderabad', city: 'Hyderabad',
    job_type: 'Full-time', min_salary: '₹75,000', max_salary: '₹90,000',
    description: 'AIIMS Hyderabad invites applications for Junior Resident positions in General Medicine. Residents will rotate through sub-specialties, conduct research and participate in academic activities.',
    requirements: 'MBBS from a recognised institution\nMCI/NMC registration\nINI-CET / NEET-PG cleared\nMotivation for academic and research activities',
    is_active: true,
  },
  {
    hr_email: 'hr4@aiims.edu',
    title: 'Senior Resident – Psychiatry', company_name: 'AIIMS Hyderabad',
    category: 'Psychiatry', location: 'Hyderabad', city: 'Hyderabad',
    job_type: 'Full-time', min_salary: '₹90,000', max_salary: '₹1,10,000',
    description: 'Applications are invited for Senior Resident posts in Psychiatry at AIIMS Hyderabad renowned mental health department. You will manage inpatient/outpatient cases and co-supervise PG students.',
    requirements: 'MBBS + MD/DNB Psychiatry\nNMC full registration\nExperience in addiction medicine is advantageous\nGood research aptitude',
    is_active: true,
  },
];

// ─────────────────────────────────────────────
// 6. HR-POSTED JOBS (mcare_job_posts)
// ─────────────────────────────────────────────
const HR_JOB_POSTS = [
  {
    title: 'Senior Nurse – ICU', department: 'Nursing', location: 'Hyderabad',
    job_type: 'full-time', experience: '3+ Years', salary: '₹4,00,000 – ₹6,00,000 per annum',
    positions: 5,
    description: 'MCARE is recruiting experienced ICU Nurses for its partner hospitals in Hyderabad. Candidates should have hands-on experience in critical care settings.',
    requirements: 'BSc / GNM Nursing\n3+ years ICU experience\nBLS/ACLS certification\nAbility to work in 12-hour shifts',
    benefits: 'Competitive salary\nHealth insurance for family\nPF and gratuity\nAnnual performance bonus',
    status: 'active',
  },
  {
    title: 'Medical Lab Technician', department: 'Pathology', location: 'Bangalore',
    job_type: 'full-time', experience: '2+ Years', salary: '₹3,00,000 – ₹4,50,000 per annum',
    positions: 3,
    description: 'We are looking for qualified Medical Lab Technicians to work at MCARE partner diagnostic centres in Bangalore.',
    requirements: 'BMLT / DMLT qualification\n2+ years lab experience\nProficiency in hematology, biochemistry and microbiology\nAccuracy and attention to detail',
    benefits: 'ESI and PF\nFree health checkup\nLearning and development allowance',
    status: 'active',
  },
  {
    title: 'Physiotherapist', department: 'Rehabilitation', location: 'Chennai',
    job_type: 'full-time', experience: '1+ Year', salary: '₹3,50,000 – ₹5,00,000 per annum',
    positions: 2,
    description: 'MCARE is hiring Physiotherapists for rehabilitation centres. The role involves assessment, planning and delivering physiotherapy to patients recovering from surgery or injury.',
    requirements: 'BPT / MPT degree\n1+ year of clinical experience\nKnowledge of electrotherapy and manual therapy\nExcellent interpersonal skills',
    benefits: 'Salary as per industry standards\nProfessional development support\nFlexible working hours',
    status: 'active',
  },
  {
    title: 'Hospital Administrator', department: 'Administration', location: 'Hyderabad',
    job_type: 'full-time', experience: '5+ Years', salary: '₹8,00,000 – ₹12,00,000 per annum',
    positions: 1,
    description: 'Seeking a proactive Hospital Administrator to oversee day-to-day operations of a 200-bed multi-specialty hospital in Hyderabad. Responsibilities include HR coordination, budgeting and compliance.',
    requirements: 'MBA (Healthcare Management) or equivalent\n5+ years hospital administration experience\nStrong leadership skills\nKnowledge of NABH standards',
    benefits: 'Senior leadership role\nPerformance-linked incentives\nFleet car / transport allowance',
    status: 'active',
  },
];

// ─────────────────────────────────────────────
// 7. MESSAGES  (between users, resolved below)
// ─────────────────────────────────────────────
const MESSAGE_TEMPLATES = [
  { from_email:'hr1@apollohospitals.com', to_email:'vineela@gmail.com',     text:'Dear Dr Vineela, thank you for applying to our Senior Cardiologist position. We would like to schedule a preliminary interview at your convenience.' },
  { from_email:'vineela@gmail.com',       to_email:'hr1@apollohospitals.com',text:'Dear Dr Rajesh, thank you for reaching out. I am available for an interview on weekdays between 10 AM and 1 PM. Please let me know a suitable time.' },
  { from_email:'hr2@fortishealthcare.com',to_email:'arjun.patel@gmail.com',  text:'Dear Dr Arjun, we reviewed your profile and are impressed by your orthopaedic expertise. Could you share your updated CV and references?' },
  { from_email:'arjun.patel@gmail.com',   to_email:'hr2@fortishealthcare.com',text:'Hello! Certainly, I will send my CV and references by end of day. Looking forward to the opportunity at Fortis.' },
  { from_email:'hr3@manipalhospitals.com',to_email:'sanjay.g@gmail.com',     text:'Dr Sanjay, your application for the Neurosurgeon role has been shortlisted. Please complete the online skill assessment by Friday.' },
];

// ─────────────────────────────────────────────
// 8. GUEST APPLICATIONS
// ─────────────────────────────────────────────
const GUEST_APPLICATIONS = [
  { name:'Lakshmi Narayanan', email:'lakshmi.n@gmail.com',   phone:'9876543300', country_code:'+91', cover_letter:'I am a BSc Nursing graduate with 2 years ICU experience looking for opportunities in Hyderabad. I am confident my skills match your requirements.', resume_url:'https://via.placeholder.com/resume', status:'Pending' },
  { name:'Vivek Tiwari',      email:'vivek.t@yahoo.com',      phone:'9876543301', country_code:'+91', cover_letter:'I am an MBBS graduate seeking a junior resident position. My clinical rotations in internal medicine and surgery have given me solid foundational experience.', resume_url:'https://via.placeholder.com/resume', status:'Pending' },
  { name:'Ritu Bajaj',        email:'ritu.b@gmail.com',        phone:'9876543302', country_code:'+91', cover_letter:'Experienced DMLT technician with 4 years in accredited labs. I am passionate about delivering accurate diagnostic results.', resume_url:'https://via.placeholder.com/resume', status:'Reviewed' },
  { name:'Kiran Rao',         email:'kiran.rao@hotmail.com',  phone:'9876543303', country_code:'+91', cover_letter:'Physiotherapist with 3 years clinical experience in orthopaedic and neuro rehab. Seeking challenging opportunities in Bangalore or Hyderabad.', resume_url:'https://via.placeholder.com/resume', status:'Pending' },
];

// ─────────────────────────────────────────────
// 9. GUEST JOBS (unregistered employer postings)
// ─────────────────────────────────────────────
const GUEST_JOBS = [
  { company_name:'Sunshine Clinic',  email:'hr@sunshineclinic.in', phone:'9000000101', country_code:'+91', job_title:'General Physician',     location:'Hyderabad', job_description:'Small clinic in Secunderabad seeking a full-time GP with MBBS + 2 years experience. Flexible timings, good compensation package.', status:'Pending Review' },
  { company_name:'LifeCare Hospital',email:'jobs@lifecare.com',    phone:'9000000102', country_code:'+91', job_title:'Gynaecologist',          location:'Chennai',   job_description:'LifeCare Hospital Chennai is hiring an experienced Gynaecologist / Obstetrician for full-time work. MBBS + MD/DNB required.', status:'Pending Review' },
  { company_name:'VitaLab Diagnostics',email:'recruit@vitalab.in',phone:'9000000103', country_code:'+91', job_title:'Radiographer (X-Ray)',   location:'Mumbai',    job_description:'VitaLab is hiring a Radiographer for X-Ray and CT operations. DMRT qualification mandatory, 1 year experience preferred.', status:'Approved' },
];

// ─────────────────────────────────────────────
// MAIN SEED FUNCTION
// ─────────────────────────────────────────────
async function seed() {
  console.log('\n🌱  Starting MCARE seed...\n');

  // ── 0. Clean previous seed data (safe re-run) ─────────────────────────────
  console.log('🧹  Cleaning previous seed data...');
  await pool.query(`DELETE FROM activity_logs WHERE 1=1`);
  await pool.query(`DELETE FROM guest_jobs WHERE 1=1`);
  await pool.query(`DELETE FROM guest_applications WHERE 1=1`);
  await pool.query(`DELETE FROM messages WHERE 1=1`);
  await pool.query(`DELETE FROM job_alerts WHERE 1=1`);
  await pool.query(`DELETE FROM saved_jobs WHERE 1=1`);
  await pool.query(`DELETE FROM applications WHERE 1=1`);
  await pool.query(`DELETE FROM mcare_job_posts WHERE 1=1`);
  await pool.query(`DELETE FROM jobs WHERE 1=1`);
  await pool.query(`DELETE FROM candidate_profiles WHERE user_id IN (SELECT id FROM users WHERE email=ANY($1))`,
    [Object.keys(CANDIDATE_PROFILES)]);
  await pool.query(`DELETE FROM employer_profiles WHERE user_id IN (SELECT id FROM users WHERE email=ANY($1))`,
    [Object.keys(EMPLOYER_PROFILES)]);
  await pool.query(`DELETE FROM users WHERE email=ANY($1)`,
    [USERS.map(u => u.email)]);
  console.log('   ✅  Clean done\n');

  // ── A. Insert Users ───────────────────────────────────────────────────────
  console.log('👤  Inserting users...');
  const emailToId = {};

  for (const u of USERS) {
    const res = await pool.query(
      `INSERT INTO users (title, full_name, email, password, phone_number, role, is_verified, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,true, NOW() - (random()*60 || ' days')::interval)
       ON CONFLICT (email) DO UPDATE SET full_name=EXCLUDED.full_name
       RETURNING id`,
      [u.title, u.full_name, u.email, HASH, u.phone, u.role]
    );
    emailToId[u.email] = res.rows[0].id;
    console.log(`   ✅  ${u.role.padEnd(10)} | ${u.full_name} (id=${res.rows[0].id})`);
  }

  // ── B. Employer Profiles ──────────────────────────────────────────────────
  console.log('\n🏥  Inserting employer profiles...');
  for (const [email, ep] of Object.entries(EMPLOYER_PROFILES)) {
    const uid = emailToId[email];
    if (!uid) continue;
    await pool.query(
      `INSERT INTO employer_profiles (user_id, organization_name, organization_category, number_of_beds, organization_city, organization_address, website_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (user_id) DO UPDATE SET organization_name=EXCLUDED.organization_name`,
      [uid, ep.organization_name, ep.organization_category, ep.number_of_beds, ep.organization_city, ep.organization_address, ep.website_url]
    );
    console.log(`   ✅  ${ep.organization_name}`);
  }

  // ── C. Candidate Profiles ─────────────────────────────────────────────────
  console.log('\n🩺  Inserting candidate profiles...');
  for (const [email, cp] of Object.entries(CANDIDATE_PROFILES)) {
    const uid = emailToId[email];
    if (!uid) continue;
    await pool.query(
      `INSERT INTO candidate_profiles (user_id, qualification, current_position, current_experience, preferred_job_type, preferred_location, expected_salary, skills, gender)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (user_id) DO UPDATE SET qualification=EXCLUDED.qualification`,
      [uid, cp.qualification, cp.current_position, cp.current_experience, cp.preferred_job_type, cp.preferred_location, cp.expected_salary, cp.skills, cp.gender]
    );
    console.log(`   ✅  ${email}`);
  }

  // ── D. Employer-posted Jobs ───────────────────────────────────────────────
  console.log('\n💼  Inserting employer-posted jobs...');
  const jobIds = [];
  const jobHrEmails = [];

  for (const jt of JOB_TEMPLATES) {
    const empId = emailToId[jt.hr_email];
    if (!empId) { console.warn(`   ⚠️  Skipping job (employer not found): ${jt.title}`); continue; }

    const res = await pool.query(
      `INSERT INTO jobs (employer_id, title, company_name, category, location, city, job_type, min_salary, max_salary, description, requirements, is_active, created_at, expires_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,true,
               NOW() - (random()*30 || ' days')::interval,
               NOW() + '90 days'::interval)
       RETURNING id`,
      [empId, jt.title, jt.company_name, jt.category, jt.location, jt.city, jt.job_type, jt.min_salary, jt.max_salary, jt.description, jt.requirements]
    );
    jobIds.push(res.rows[0].id);
    jobHrEmails.push(jt.hr_email);
    console.log(`   ✅  [job id=${res.rows[0].id}] ${jt.title} @ ${jt.company_name}`);
  }

  // ── E. HR-posted Jobs (mcare_job_posts) ───────────────────────────────────
  console.log('\n📋  Inserting HR job posts...');
  const hrJobIds = [];

  for (const hjp of HR_JOB_POSTS) {
    const res = await pool.query(
      `INSERT INTO mcare_job_posts (title, department, location, job_type, experience, salary, positions, description, requirements, benefits, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11, NOW() - (random()*20 || ' days')::interval)
       RETURNING id`,
      [hjp.title, hjp.department, hjp.location, hjp.job_type, hjp.experience, hjp.salary, hjp.positions, hjp.description, hjp.requirements, hjp.benefits, hjp.status]
    );
    hrJobIds.push(res.rows[0].id);
    console.log(`   ✅  [hr_job id=${res.rows[0].id}] ${hjp.title}`);
  }

  // ── F. Applications ───────────────────────────────────────────────────────
  console.log('\n📝  Inserting applications...');
  const STATUSES = ['Under Review','Under Review','Shortlisted','Interview Scheduled','Offered','Rejected'];

  const candidateEmails = ['vineela@gmail.com','arjun.patel@gmail.com','meena.k@gmail.com','sanjay.g@gmail.com','ananya.s@gmail.com','rahul.d@gmail.com'];

  // Each candidate applies to 2–3 employer jobs
  const appPairs = [
    { cEmail:'vineela@gmail.com',     jobIdx:0 },  // Cardiologist @ Apollo
    { cEmail:'vineela@gmail.com',     jobIdx:6 },  // JR @ AIIMS
    { cEmail:'arjun.patel@gmail.com', jobIdx:3 },  // Ortho @ Fortis
    { cEmail:'arjun.patel@gmail.com', jobIdx:1 },  // Surgeon @ Apollo
    { cEmail:'meena.k@gmail.com',     jobIdx:2 },  // Paed @ Fortis
    { cEmail:'sanjay.g@gmail.com',    jobIdx:4 },  // Neuro @ Manipal
    { cEmail:'sanjay.g@gmail.com',    jobIdx:7 },  // SR Psych @ AIIMS
    { cEmail:'ananya.s@gmail.com',    jobIdx:5 },  // Radiologist @ Manipal
    { cEmail:'rahul.d@gmail.com',     jobIdx:0 },  // Cardiologist @ Apollo
    { cEmail:'rahul.d@gmail.com',     jobIdx:4 },  // Neuro @ Manipal
  ];

  for (const ap of appPairs) {
    const uid = emailToId[ap.cEmail];
    const jid = jobIds[ap.jobIdx];
    if (!uid || !jid) continue;
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    try {
      await pool.query(
        `INSERT INTO applications (job_id, user_id, cover_letter_path, availability, status, applied_at)
         VALUES ($1,$2,$3,'Immediate',$4, NOW() - (random()*14 || ' days')::interval)
         ON CONFLICT DO NOTHING`,
        [jid, uid, 'I am excited about this opportunity and believe my skills align perfectly with your requirements.', status]
      );
      console.log(`   ✅  ${ap.cEmail.split('@')[0].padEnd(15)} → job ${jid} [${status}]`);
    } catch (e) {
      console.log(`   ⏭️   Skipped duplicate: ${ap.cEmail} → job ${jid}`);
    }
  }

  // Some candidates also apply to HR job posts
  const hrAppPairs = [
    { cEmail:'vineela@gmail.com',     hrJobIdx:0 },
    { cEmail:'meena.k@gmail.com',     hrJobIdx:0 },
    { cEmail:'ananya.s@gmail.com',    hrJobIdx:1 },
    { cEmail:'arjun.patel@gmail.com', hrJobIdx:2 },
  ];

  for (const ap of hrAppPairs) {
    const uid = emailToId[ap.cEmail];
    const hjid = hrJobIds[ap.hrJobIdx];
    if (!uid || !hjid) continue;
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    try {
      await pool.query(
        `INSERT INTO applications (hr_job_id, user_id, cover_letter_path, availability, status, applied_at)
         VALUES ($1,$2,$3,'Flexible',$4, NOW() - (random()*10 || ' days')::interval)
         ON CONFLICT DO NOTHING`,
        [hjid, uid, 'I am very keen to contribute to MCARE and its partner hospitals.', status]
      );
      console.log(`   ✅  ${ap.cEmail.split('@')[0].padEnd(15)} → hr_job ${hjid} [${status}]`);
    } catch (e) {
      console.log(`   ⏭️   Skipped duplicate: ${ap.cEmail} → hr_job ${hjid}`);
    }
  }

  // ── G. Saved Jobs ─────────────────────────────────────────────────────────
  console.log('\n❤️   Inserting saved jobs...');
  const savedPairs = [
    { cEmail:'vineela@gmail.com',     jobIdx:4 },
    { cEmail:'arjun.patel@gmail.com', jobIdx:4 },
    { cEmail:'meena.k@gmail.com',     jobIdx:3 },
    { cEmail:'rahul.d@gmail.com',     jobIdx:1 },
    { cEmail:'ananya.s@gmail.com',    jobIdx:2 },
  ];
  for (const sp of savedPairs) {
    const uid = emailToId[sp.cEmail];
    const jid = jobIds[sp.jobIdx];
    if (!uid || !jid) continue;
    await pool.query(
      `INSERT INTO saved_jobs (user_id, job_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
      [uid, jid]
    );
    console.log(`   ✅  ${sp.cEmail.split('@')[0]} saved job ${jid}`);
  }

  // ── H. Job Alerts ─────────────────────────────────────────────────────────
  console.log('\n🔔  Inserting job alerts...');
  const alerts = [
    { cEmail:'vineela@gmail.com',     title:'Cardiologist Jobs in Hyderabad', keywords:'cardiologist, cardiology', location:'Hyderabad', job_type:'Full-time', frequency:'Daily' },
    { cEmail:'arjun.patel@gmail.com', title:'Orthopaedic Jobs in Bangalore',  keywords:'orthopaedic, surgeon',    location:'Bangalore', job_type:'Full-time', frequency:'Weekly' },
    { cEmail:'meena.k@gmail.com',     title:'Paediatrics Openings',           keywords:'paediatrician, paediatrics',location:'Chennai', job_type:'Full-time', frequency:'Daily' },
    { cEmail:'sanjay.g@gmail.com',    title:'Neurosurgery Positions',         keywords:'neurosurgeon, brain, spine',location:'Hyderabad',job_type:'Full-time', frequency:'Daily' },
    { cEmail:'rahul.d@gmail.com',     title:'Cardiology Roles Nationwide',    keywords:'cardiologist, interventional cardiology',location:'',job_type:'Full-time', frequency:'Weekly' },
  ];
  for (const al of alerts) {
    const uid = emailToId[al.cEmail];
    if (!uid) continue;
    await pool.query(
      `INSERT INTO job_alerts (user_id, title, keywords, location, job_type, frequency, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,true)`,
      [uid, al.title, al.keywords, al.location, al.job_type, al.frequency]
    );
    console.log(`   ✅  Alert: "${al.title}"`);
  }

  // ── I. Messages ───────────────────────────────────────────────────────────
  console.log('\n💬  Inserting messages...');
  for (const m of MESSAGE_TEMPLATES) {
    const sid = emailToId[m.from_email];
    const rid = emailToId[m.to_email];
    if (!sid || !rid) continue;
    await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, message_text, is_read, sent_at)
       VALUES ($1,$2,$3,$4, NOW() - (random()*7 || ' days')::interval)`,
      [sid, rid, m.text, Math.random() > 0.5]
    );
    console.log(`   ✅  ${m.from_email.split('@')[0]} → ${m.to_email.split('@')[0]}`);
  }

  // ── J. Activity Logs ──────────────────────────────────────────────────────
  console.log('\n📊  Inserting activity logs...');
  const activityEntries = [
    { email:'vineela@gmail.com',       action:'login',          description:'User logged in'                       },
    { email:'vineela@gmail.com',       action:'job_apply',      description:'Applied to Senior Cardiologist role'  },
    { email:'arjun.patel@gmail.com',   action:'login',          description:'User logged in'                       },
    { email:'arjun.patel@gmail.com',   action:'job_apply',      description:'Applied to Orthopaedic Surgeon role'  },
    { email:'meena.k@gmail.com',       action:'profile_update', description:'Candidate updated profile details'    },
    { email:'sanjay.g@gmail.com',      action:'job_apply',      description:'Applied to Neurosurgeon role'         },
    { email:'hr1@apollohospitals.com', action:'login',          description:'HR user logged in'                    },
    { email:'hr1@apollohospitals.com', action:'job_post',       description:'Posted Senior Cardiologist job'       },
    { email:'hr2@fortishealthcare.com',action:'login',          description:'HR user logged in'                    },
    { email:'admin@mcare.com',         action:'login',          description:'Admin logged in'                      },
    { email:'admin@mcare.com',         action:'admin_action',   description:'Reviewed pending applications'        },
  ];
  // Detect columns to handle both old and new schema
  const colRes = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name='activity_logs'`
  );
  const actCols = colRes.rows.map(r => r.column_name);
  const hasUserId = actCols.includes('user_id');

  for (const entry of activityEntries) {
    const uid = emailToId[entry.email];
    if (!uid) continue;
    if (hasUserId) {
      await pool.query(
        `INSERT INTO activity_logs (user_id, action, description, ip_address, user_role, created_at)
         VALUES ($1,$2,$3,'127.0.0.1',(SELECT role FROM users WHERE id=$1), NOW() - (random()*5 || ' days')::interval)`,
        [uid, entry.action, entry.description]
      );
    } else {
      // older schema: type, action, username, details
      const uRes = await pool.query('SELECT full_name, role FROM users WHERE id=$1', [uid]);
      const { full_name, role } = uRes.rows[0] || {};
      await pool.query(
        `INSERT INTO activity_logs (type, action, username, details, created_at)
         VALUES ($1,$2,$3,$4, NOW() - (random()*5 || ' days')::interval)`,
        [role || 'user', entry.action, full_name || '', entry.description]
      );
    }
  }
  console.log(`   ✅  ${activityEntries.length} activity log entries`);

  // ── K. Guest Applications ─────────────────────────────────────────────────
  console.log('\n📨  Inserting guest applications...');
  for (const ga of GUEST_APPLICATIONS) {
    await pool.query(
      `INSERT INTO guest_applications (name, email, phone, country_code, cover_letter, resume_url, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [ga.name, ga.email, ga.phone, ga.country_code, ga.cover_letter, ga.resume_url, ga.status]
    );
    console.log(`   ✅  Guest applicant: ${ga.name}`);
  }

  // ── L. Guest Jobs ─────────────────────────────────────────────────────────
  console.log('\n🏢  Inserting guest jobs...');
  for (const gj of GUEST_JOBS) {
    await pool.query(
      `INSERT INTO guest_jobs (company_name, email, phone, country_code, job_title, location, job_description, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [gj.company_name, gj.email, gj.phone, gj.country_code, gj.job_title, gj.location, gj.job_description, gj.status]
    );
    console.log(`   ✅  Guest job: ${gj.job_title} @ ${gj.company_name}`);
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(60));
  console.log('🎉  MCARE seed completed successfully!\n');
  console.log('📋  Summary:');
  console.log(`   👤  Users: ${USERS.length}`);
  console.log(`   🏥  Employer profiles: ${Object.keys(EMPLOYER_PROFILES).length}`);
  console.log(`   🩺  Candidate profiles: ${Object.keys(CANDIDATE_PROFILES).length}`);
  console.log(`   💼  Jobs (employer-posted): ${JOB_TEMPLATES.length}`);
  console.log(`   📋  Jobs (HR-posted): ${HR_JOB_POSTS.length}`);
  console.log(`   📝  Applications: ${appPairs.length + hrAppPairs.length}`);
  console.log(`   ❤️   Saved jobs: ${savedPairs.length}`);
  console.log(`   🔔  Job alerts: ${alerts.length}`);
  console.log(`   💬  Messages: ${MESSAGE_TEMPLATES.length}`);
  console.log(`   📊  Activity logs: ${activityEntries.length}`);
  console.log(`   📨  Guest applications: ${GUEST_APPLICATIONS.length}`);
  console.log(`   🏢  Guest jobs: ${GUEST_JOBS.length}`);
  console.log('\n🔑  All accounts use password: Password@123');
  console.log('─'.repeat(60) + '\n');

  await pool.end();
}

seed().catch(err => {
  console.error('\n❌  Seed failed:', err.message || err);
  process.exit(1);
});
