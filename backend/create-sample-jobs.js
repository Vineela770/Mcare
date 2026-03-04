const pool = require('./config/db');

const sampleJobs = [
  {
    title: "Senior Cardiologist",
    department: "Cardiology",
    location: "Mumbai, Maharashtra",
    phone: "022-2433-5678",
    job_type: "full-time",
    experience: "5+ years",
    salary: "₹15,00,000 - ₹25,00,000 per annum",
    positions: 2,
    description: `We are seeking an experienced Senior Cardiologist to join our prestigious cardiac care team. The ideal candidate will have expertise in interventional cardiology and advanced cardiac procedures.

Key Responsibilities:
• Diagnose and treat cardiovascular diseases
• Perform cardiac interventions and surgeries
• Lead the cardiac care team
• Mentor junior doctors and residents
• Participate in research and development`,
    requirements: `• MBBS with MD/DM in Cardiology
• 5+ years of clinical experience
• Valid medical license
• Expertise in interventional cardiology
• Strong leadership and communication skills`,
    benefits: "Health insurance, PF, Medical allowance, Annual bonus, CME support",
    deadline: "2024-02-15",
    status: "active"
  },
  {
    title: "ICU Nurse - Critical Care",
    department: "Nursing",
    location: "Delhi, NCR",
    phone: "011-4567-8901",
    job_type: "full-time",
    experience: "2-4 years",
    salary: "₹4,50,000 - ₹6,50,000 per annum",
    positions: 5,
    description: `Join our critical care nursing team and make a difference in patients' lives. We're looking for dedicated ICU nurses with strong clinical skills and compassion.

Key Responsibilities:
• Monitor critically ill patients in ICU
• Administer medications and treatments
• Operate advanced medical equipment
• Collaborate with doctors and healthcare team
• Maintain accurate patient records`,
    requirements: `• B.Sc Nursing or equivalent
• 2+ years ICU experience
• Valid nursing license
• BLS and ACLS certification
• Strong clinical assessment skills`,
    benefits: "Medical insurance, Night shift allowance, Professional development opportunities",
    deadline: "2024-02-10",
    status: "active"
  },
  {
    title: "Pediatrician",
    department: "Pediatrics",
    location: "Bangalore, Karnataka",
    phone: "080-2234-5678",
    job_type: "full-time",
    experience: "3-6 years",
    salary: "₹12,00,000 - ₹18,00,000 per annum",
    positions: 1,
    description: `We are looking for a compassionate Pediatrician to provide comprehensive medical care to children from infancy through adolescence.

Key Responsibilities:
• Examine and diagnose pediatric patients
• Provide preventive care and vaccinations
• Treat common childhood illnesses
• Work with parents on child development
• Maintain detailed medical records`,
    requirements: `• MBBS with MD Pediatrics
• 3+ years of pediatric experience
• Valid medical license
• Excellent communication with children and parents
• Knowledge of latest pediatric guidelines`,
    benefits: "Competitive salary, Health benefits, Annual leave, Research opportunities",
    deadline: "2024-02-20",
    status: "active"
  },
  {
    title: "Medical Lab Technician",
    department: "Laboratory",
    location: "Chennai, Tamil Nadu",
    phone: "044-2876-5432",
    job_type: "full-time", 
    experience: "1-3 years",
    salary: "₹3,00,000 - ₹4,50,000 per annum",
    positions: 3,
    description: `Join our state-of-the-art laboratory team. We need skilled technicians to perform various diagnostic tests and maintain quality standards.

Key Responsibilities:
• Perform laboratory tests on patient samples
• Operate sophisticated medical equipment
• Ensure quality control and accuracy
• Maintain laboratory records and reports
• Follow safety protocols`,
    requirements: `• DMLT/B.Sc MLT or equivalent
• 1+ year laboratory experience
• Knowledge of laboratory equipment
• Attention to detail and accuracy
• Good computer skills`,
    benefits: "Health insurance, Skills training, Good work environment",
    deadline: "2024-02-12",
    status: "active"
  },
  {
    title: "General Physician",
    department: "General Medicine", 
    location: "Hyderabad, Telangana",
    phone: "040-2345-6789",
    job_type: "full-time",
    experience: "2-5 years",
    salary: "₹8,00,000 - ₹12,00,000 per annum", 
    positions: 2,
    description: `We are seeking dedicated General Physicians to provide primary healthcare services. The role involves diagnosing and treating a wide range of medical conditions.

Key Responsibilities:
• Provide primary care to patients
• Diagnose and treat common medical conditions
• Refer patients to specialists when needed
• Maintain comprehensive patient records
• Participate in health awareness programs`,
    requirements: `• MBBS with valid medical license
• 2+ years of clinical experience
• Strong diagnostic skills
• Excellent patient communication
• Knowledge of electronic medical records`,
    benefits: "Competitive package, Medical benefits, Professional growth opportunities",
    deadline: "2024-02-18",
    status: "active"
  },
  {
    title: "Hospital Administrator",
    department: "Administration",
    location: "Pune, Maharashtra", 
    phone: "020-2567-8901",
    job_type: "full-time",
    experience: "4-7 years",
    salary: "₹6,00,000 - ₹10,00,000 per annum",
    positions: 1,
    description: `Lead our hospital operations and ensure efficient healthcare delivery. We need an experienced administrator to oversee daily operations and strategic planning.

Key Responsibilities:
• Oversee hospital operations and administration
• Manage staff and departmental coordination
• Ensure compliance with healthcare regulations
• Budget planning and financial management
• Implement quality improvement initiatives`,
    requirements: `• MBA/MHA in Healthcare Management
• 4+ years hospital administration experience
• Knowledge of healthcare regulations
• Strong leadership and management skills
• Experience with hospital information systems`,
    benefits: "Executive benefits, Performance bonus, Health coverage for family",
    deadline: "2024-02-22",
    status: "active"
  }
];

async function createSampleJobs() {
  try {
    console.log("🔄 Creating sample jobs...");
    
    // Clear existing jobs first
    await pool.query("DELETE FROM mcare_job_posts");
    console.log("✅ Cleared existing jobs");
    
    // Insert sample jobs
    for (const job of sampleJobs) {
      const result = await pool.query(
        `INSERT INTO mcare_job_posts 
        (title, department, location, phone, job_type, experience, salary, positions, description, requirements, benefits, deadline, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id, title`,
        [
          job.title,
          job.department, 
          job.location,
          job.phone,
          job.job_type,
          job.experience,
          job.salary,
          job.positions,
          job.description,
          job.requirements,
          job.benefits,
          job.deadline,
          job.status
        ]
      );
      console.log(`✅ Created job: ${result.rows[0].title} (ID: ${result.rows[0].id})`);
    }
    
    console.log(`🎉 Successfully created ${sampleJobs.length} sample jobs!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating sample jobs:", error);
    process.exit(1);
  }
}

createSampleJobs();