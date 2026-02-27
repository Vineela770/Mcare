import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Modal from '../../components/common/Modal';
import { CheckCircle } from 'lucide-react';
import jobService from '../../api/jobService';

const Home = () => {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [activeTab, setActiveTab] = useState('latest');
  const [activeDot, setActiveDot] = useState(0);
  const [categoryIndex, setCategoryIndex] = useState(0);

  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [logoIndex, setLogoIndex] = useState(0);

  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [filterSalary, setFilterSalary] = useState('');

  const [showQuickApplyModal, setShowQuickApplyModal] = useState(false);
  const [showQuickPostModal, setShowQuickPostModal] = useState(false);
  const [quickApplyErrors, setQuickApplyErrors] = useState({});
  const [quickPostErrors, setQuickPostErrors] = useState({});

  const popularJobsRef = useRef(null);

  const [quickApplyData, setQuickApplyData] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    phone: '',
    coverLetter: '',
    resume: null,
  });

  // ✅ Backend Jobs State - Dynamic Category Counts
  const [liveJobs, setLiveJobs] = useState([]);

  // ✅ Fetch Jobs from Backend
  useEffect(() => {
    const fetchLiveJobs = async () => {
      try {
        const jobsData = await jobService.getJobs();
        setLiveJobs(jobsData || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLiveJobs([]);
      }
    };
    fetchLiveJobs();
  }, []);

  // ✅ Dynamic Job Count by Category
  const getJobCountByCategory = (categoryKey) => {
    return liveJobs.filter(job => 
      job.categoryKey === categoryKey || 
      job.category?.toLowerCase().includes(categoryKey.toLowerCase())
    ).length;
  };

  const [quickPostData, setQuickPostData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    countryCode: '+91',
    phone: '',
    jobTitle: '',
    location: '',
    jobDescription: '',
  });

  const countryCodes = [
    { code: '+91', label: '🇮🇳 +91 (India)' },
    { code: '+1', label: '🇺🇸 +1 (USA)' },
    { code: '+44', label: '🇬🇧 +44 (UK)' },
    { code: '+61', label: '🇦🇺 +61 (Australia)' },
    { code: '+971', label: '🇦🇪 +971 (UAE)' },
  ];

  const hospitalLogos = [
    '/hospitals/archana.png',
    '/hospitals/aster.png',
    '/hospitals/srikara.png',
    '/hospitals/sunrise.png',
    '/hospitals/kims.png',
    '/hospitals/yashoda.png',
  ];

  const LOGOS_PER_SLIDE = 3;

  const handleLogoPrev = () => {
    setLogoIndex((prev) =>
      prev === 0 ? Math.ceil(hospitalLogos.length / LOGOS_PER_SLIDE) - 1 : prev - 1
    );
  };

  const handleLogoNext = () => {
    setLogoIndex((prev) =>
      prev === Math.ceil(hospitalLogos.length / LOGOS_PER_SLIDE) - 1 ? 0 : prev + 1
    );
  };

  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: '',
  });

  const cities = [
    'Miyapur',
    'Kukatpally',
    'Chandanagar',
    'Lingampally',
    'LB Nagar',
    'Ameerpet',
    'Mehdipatnam',
    'Gachibowli',
  ];

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = () => {
    setShowApplyModal(false);
    setSuccessMessage(`Application submitted for ${selectedJob?.title}!`);
    setShowSuccessModal(true);
    setApplicationData({ coverLetter: '', expectedSalary: '', availability: '' });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (jobTitle) params.append('search', jobTitle);
    if (city) params.append('location', city);
    navigate(`/jobs?${params.toString()}`);
  };

  // ✅ Browse Jobs navigation (NEW)
  const browseItems = [
    { label: 'Cardiologist', value: 'Cardiologist' },
    { label: 'Neurologist', value: 'Neurologist' },
    { label: 'Gynecologist', value: 'Gynecologist' },
    { label: 'Radiologist', value: 'Radiologist' },
    { label: 'Pediatrician', value: 'Pediatrician' },
    { label: 'Orthopedic', value: 'Orthopedic' },
    { label: 'Pulmonologist', value: 'Pulmonologist' },
    { label: 'Pharmacist', value: 'Pharmacist' },
  ];

  const goToBrowse = (spec) => {
    const params = new URLSearchParams();
    // keep search box values if user typed
    if (jobTitle) params.append('search', jobTitle);
    if (city) params.append('location', city);

    // specialization navigation
    params.set('specialization', spec);
    // (optional) also set search keyword so it works even if your Jobs page only reads "search"
    params.set('search', spec);

    navigate(`/jobs?${params.toString()}`);
  };

  const categories = [
    { id: 1, title: 'Hospital Jobs – Doctors', icon: '🏥', positions: getJobCountByCategory('doctors'), key: 'doctors' },
    { id: 2, title: 'Hospital Management', icon: '📊', positions: getJobCountByCategory('management'), key: 'management' },
    { id: 3, title: 'Medical Colleges', icon: '🎓', positions: getJobCountByCategory('colleges'), key: 'colleges' },
    { id: 4, title: 'Allied Health', icon: '🩺', positions: getJobCountByCategory('allied'), key: 'allied' },
    { id: 5, title: 'Nursing', icon: '👩‍⚕️', positions: getJobCountByCategory('nursing'), key: 'nursing' },
    { id: 6, title: 'Alternative Medicine', icon: '🌿', positions: getJobCountByCategory('alternative'), key: 'alternative' },
    { id: 7, title: 'Dental', icon: '🦷', positions: getJobCountByCategory('dental'), key: 'dental' },
  ];

  const tabs = [
    { id: 'latest', label: 'Latest Jobs' },
    { id: 'doctors', label: 'Hospital Jobs Doctors' },
    { id: 'management', label: 'Hospital Management' },
    { id: 'colleges', label: 'Medical Colleges' },
    { id: 'allied', label: 'Allied Health' },
    { id: 'alternative', label: 'Alternative Medicine' },
    { id: 'nursing', label: 'Nursing' },
    { id: 'dental', label: 'Dental' }, // beside Nursing
  ];

  const visibleTabs = 6; // number of tabs visible at once

  const nextCategory = () => {
    if (categoryIndex + visibleTabs < tabs.length) {
      setCategoryIndex(categoryIndex + 1);
    }
  };

  const prevCategory = () => {
    if (categoryIndex > 0) {
      setCategoryIndex(categoryIndex - 1);
    }
  };

  const salaryRanges = [
    { label: 'Salary Range', value: '' },
    { label: 'Below ₹50,000', value: '0-50000' },
    { label: '₹50,000 – ₹1,00,000', value: '50000-100000' },
    { label: '₹1,00,000 – ₹5,00,000', value: '100000-500000' },
    { label: 'Above ₹5,00,000', value: '500000-99999999' },
  ];


  // ✅ Category → Degree → Specializations hierarchy
  const categorySpecializations = {
    // 🏥 DOCTORS
    doctors: {
      MBBS: [
        'MBBS',
      ],

      MD: [
        'MD – General Medicine',
        'MD – Paediatrics',
        'MD – Dermatology, Venereology & Leprosy',
        'MD – Psychiatry',
        'MD – Anaesthesiology',
        'MD – Radiodiagnosis',
        'MD – Radiation Oncology',
        'MD – Emergency Medicine',
        'MD – Respiratory Medicine',
        'MD – Pathology',
        'MD – Microbiology',
        'MD – Pharmacology',
        'MD – Physiology',
        'MD – Biochemistry',
        'MD – Community Medicine',
        'MD – Forensic Medicine',
        'MD – Nuclear Medicine',
        'MD – Palliative Medicine',
        'MD – Physical Medicine & Rehabilitation',
        'MD – Hospital Administration',
        'MD – Family Medicine',
        'MD – Sports Medicine',
        'MD – Tropical Medicine',
      ],

      MS: [
        'MS – General Surgery',
        'MS – Obstetrics & Gynaecology',
        'MS – Orthopaedics',
        'MS – Ophthalmology',
        'MS – ENT (Otorhinolaryngology)',
      ],

      DM: [
        'DM – Cardiology',
        'DM – Neurology',
        'DM – Nephrology',
        'DM – Endocrinology',
        'DM – Gastroenterology',
        'DM – Medical Oncology',
        'DM – Clinical Haematology',
        'DM – Pulmonary Medicine',
        'DM – Critical Care Medicine',
        'DM – Paediatric Cardiology',
        'DM – Neonatology',
        'DM – Hepatology',
        'DM – Infectious Disease',
        'DM – Interventional Radiology',
        'DM – Medical Genetics',
        'DM – Neuro Anaesthesia',
        'DM – Neuro-radiology',
        'DM – Organ Transplant Anaesthesia and Critical Care',
      ],

      MCh: [
        'MCh – Neurosurgery',
        'MCh – Urology',
        'MCh – Surgical Oncology',
        'MCh – Plastic & Reconstructive Surgery',
        'MCh – Cardiothoracic Surgery',
        'MCh – Paediatric Surgery',
        'MCh – Surgical Gastroenterology',
        'MCh – Endocrine Surgery',
        'MCh – Gynaecological Oncology',
        'MCh – Hand Surgery',
        'MCh – Head & Neck Surgery',
        'MCh – Hepato-Pancreato-Biliary Surgery',
        'MCh – Thoracic Surgery',
        'MCh – Cardiac Surgery',
      ],

      Diplomas: [
        'DCH – Paediatrics',
        'DGO – Obstetrics & Gynaecology',
        'DCP – Clinical Pathology',
        'DLO – ENT',
        'DMRD – Radiodiagnosis',
        'DDVL – Dermatology',
        'DPM – Psychiatry',
        'DTCD – Tuberculosis & Chest Diseases',
        'Diploma – Anaesthesia (DA)',
        'Diploma – Dermatology (DDVL)',
        'Diploma – Ophthalmology (DO)',
        'Diploma – Orthopaedics (DOrtho)',
        'Diploma – Otorhinolaryngology (DLO)',
        'Diploma – Radio-diagnosis (DMRD)',
        'Diploma – Radiation Medicine (DRM)',
        'Diploma – Tropical Medicine & Health (DTM&H)',
      ],

      DNB: [
        'DNB – Diplomate of National Board',
      ],

      Fellowships: [
        'Fellowship – Cardiac Anaesthesia',
        'Fellowship – Critical Care Medicine',
        'Fellowship – Hand & Micro Surgery',
        'Fellowship – Infectious Disease',
        'Fellowship – Interventional Cardiology',
        'Fellowship – Minimal Access Surgery',
        'Fellowship – Paediatric Cardiology',
        'Fellowship – Paediatric Gastroenterology',
        'Fellowship – Paediatric Intensive Care',
        'Fellowship – Reproductive Medicine',
        'Fellowship – Spine Surgery',
        'Fellowship – Sports Medicine',
        'Fellowship – Trauma Care',
        'Fellowship – Vitreo Retinal Surgery',
        'Fellowship – Medical Oncology',
        'Fellowship – Diabetology',
      ],

      PhD: [
        'PhD – Anaesthesia',
        'PhD – Anatomy',
        'PhD – Biochemistry',
        'PhD – Cardiology',
        'PhD – Community Medicine',
        'PhD – Dermatology',
        'PhD – Endocrinology',
        'PhD – Forensic Medicine',
        'PhD – Gastroenterology',
        'PhD – Haematology',
        'PhD – Hospital Administration',
        'PhD – Medical Biochemistry',
        'PhD – Medical Oncology',
        'PhD – Medicine',
        'PhD – Microbiology',
        'PhD – Neurology',
        'PhD – Nuclear Medicine',
        'PhD – Obstetrics & Gynaecology',
        'PhD – Orthopaedics',
        'PhD – Pathology',
        'PhD – Pharmacology',
        'PhD – Physiology',
        'PhD – Psychiatry',
        'PhD – Radiodiagnosis',
        'PhD – Radiotherapy',
        'PhD – Surgery',
        'PhD – Urology',
      ],

      Masters: [
        'Master of Hospital Administration',
        'Master of Public Health',
        'Master of Public Health – Epidemiology',
      ],

      MSc: [
        'MSc – Medical Anatomy',
        'MSc – Medical Biochemistry',
        'MSc – Medical Microbiology',
        'MSc – Medical Physiology',
        'MSc – Medical Pharmacology',
        'MSc – Pathology',
        'MSc – Statistics',
      ],

      FCPS: [
        'FCPS – Medicine',
        'FCPS – Surgery',
        'FCPS – Pathology',
        'FCPS – Dermatology, Venereology & Leprosy',
        'FCPS – Midwifery & Gynaecology',
        'FCPS – Ophthalmology',
      ],
    },

    // 📊 HOSPITAL MANAGEMENT
    management: {
      Administration: [
        'Hospital Director / Chief Executive Officer',
        'Chief Operating Officer',
        'General Manager',
        'Medical Superintendent',
        'Hospital Administrator / Manager',
        'Assistant Hospital Administrator',
        'Administrative Officers',
      ],

      FrontOffice: [
        'Front Office Executive - Hospitals',
        'Opening For Front Office Executive',
        'Front Office Manager',
        'Receptionist / Front Desk Staff',
        'Patient Relation Executive',
        'Patient Relations Executive',
        'Public Relations Officer',
        'Customer Service Representative',
        'Voice & Non Voice Process Customer Care Executives',
        'Service Desk Associate',
      ],

      HumanResources: [
        'HR Manager',
        'HR Dept',
        'Recruitment Officer',
        'Payroll Officer',
        'Training & Development Officer',
      ],

      FinanceAccounts: [
        'Assistant Manager F&A',
        'Senior Accountant',
        'Accounting and Finance Manager',
        'Junior Finance Executive',
        'Chief Financial Officer',
        'Accounts Manager',
        'Billing Supervisor',
        'Cashier / Billing Clerks',
        'Insurance Coordinator',
      ],

      Operations: [
        'Operations Manager',
        'Facility Manager',
        'Maintenance Supervisor',
        'Transport & Ambulance Coordinator',
        'Housekeeping Manager',
        'Security Supervisor',
        'Canteen Supervisor',
        'Laundry Supervisor',
        'Waste Management Supervisor',
      ],

      QualityCompliance: [
        'Quality Executive',
        'Quality Manager',
        'Quality & Compliance Officer',
        'Internal Auditor',
        'Legal Advisor',
      ],

      ITTechnical: [
        'IT Manager / System Administrator',
        'Network Engineer',
        'Software Support Technician',
        'Technical Support Engineer',
        'Support Engineer',
        'Data Entry Operators',
      ],

      EngineeringSupport: [
        'Biomedical Engineer',
        'Diagnostic Technician/Engineer',
        'Automobile Technician',
      ],

      MedicalRecords: [
        'Medical Records Officer',
      ],

      Marketing: [
        'Marketing',
      ],
    },


    // 🎓 MEDICAL COLLEGES
    colleges: {
      Administration: [
        'Principal',
        'Academic Coordinator',
        'Senior Assistant',
      ],

      Faculty: [
        'Professor',
        'Associate Professor',
        'Assistant Professor',
        'Academic Positions',
      ],

      Residency: [
        'Senior Resident',
        'Junior Resident',
      ],

      Training: [
        'Tutor / Demonstrator',
      ],
    },

    // 🩺 ALLIED HEALTH
    allied: {
      Physiotherapy: [
        'BPT – Bachelor of Physiotherapy',
        'MPT – Master of Physiotherapy',
      ],

      Technology: [
        'B.Sc – Anaesthesia & Operation Theatre Technology',
        'B.Sc – Cardio Vascular Technology',
        'B.Sc – Dialysis Technology',
        'B.Sc – Medical Lab Technology',
        'B.Sc – Radiology & Imaging Technology',
        'B.Sc – Respiratory Therapy',
        'B.Sc – Optometry',
        'B.Sc – Emergency & Critical Care Technology',
      ],

      Nutrition: [
        'B.Sc – Clinical Nutrition & Dietetics',
      ],

      Biotechnology: [
        'B.Sc – Medical Biotechnology',
        'Medical Biotechnology & Bioinformatics',
      ],

      ClinicalSciences: [
        'Clinical Biochemistry',
        'Clinical Microbiology',
        'Clinical Research',
      ],
    },

    // 🌿 ALTERNATIVE MEDICINE
    alternative: {
      Undergraduate: [
        'BAMS – Ayurveda',
        'BHMS – Homeopathy',
        'BNYS – Bachelor of Naturopathy and Yogic Sciences',
        'BUMS – Unani',
      ],

      Ayurveda: [
        'MD (Ayurveda) – Dravyaguna',
        'MD (Ayurveda) – Panchakarma',
        'MD (Ayurveda) – Prasuti & Streeroga',
        'MD (Ayurveda) – Samhita & Siddhanta',
        'MD (Ayurveda) – Kayachikitsa',
        'MD (Ayurveda) – Shalya Tantra',
        'MD (Ayurveda) – Rog Nidan',
        'MD (Ayurveda) – Community Medicine',
        'MD (Ayurveda) – Forensic Medicine & Toxicology',
        'MD (Ayurveda) – Pathology, Bacteriology & Parasitology',
      ],

      Homeopathy: [
        'MD (Homeopathy) – Homeopathic Materia Medica',
        'MD (Homeopathy) – Homeopathic Pharmacy',
        'MD (Homeopathy) – Organon of Medicine & Philosophy',
        'MD (Homeopathy) – Practice of Medicine',
        'MD (Homeopathy) – Paediatrics',
        'MD (Homeopathy) – Repertory',
        'MD (Homeopathy) – General',
      ],

      Naturopathy: [
        'MD (Naturopathy) – Anatomy',
        'MD (Naturopathy) – Biochemistry',
        'MD (Naturopathy) – Diagnosis',
        'MD (Naturopathy) – Dietetics & Nutrition',
        'MD (Naturopathy) – Hydrotherapy',
        'MD (Naturopathy) – Microbiology',
        'MD (Naturopathy) – Physiotherapy',
        'MD (Naturopathy) – Yoga Therapy',
        'MD (Naturopathy) – Acupuncture',
        'MD (Naturopathy) – General',
        'MSc – Yoga & Naturopathy',
        'MSc – Naturopathy',
      ],

      Unani: [
        'MD (Unani) – Ain, Uzn, Anaf, Halaq wa Asnan',
        'MD (Unani) – Amraz-e-Atfal (Paediatrics)',
        'MD (Unani) – Ilmul Advia (Pharmacology)',
        'MD (Unani) – Ilmul Jarahat',
        'MD (Unani) – Ilmul Qabalat wa Amraz-e-Niswan',
        'MD (Unani) – Ilmul Saidla wa Murakkabat',
        'MD (Unani) – Jild wa Tazeeniyat',
        'MD (Unani) – Moalejat',
        'MD (Unani) – Munafe Ul Aaza',
        'MD (Unani) – Tahaffuzi-wa-Samaji Tib',
        'MD (Unani) – Tashreeh Ul Badan',
      ],
    },


    // 🩺 NURSING
    nursing: {
      EntryLevel: [
        'ANM – Auxiliary Nurse Midwife',
        'GNM – General Nursing and Midwifery',
        'Auxiliary Nurse & Midwife (ANM)',
        'General Nursing & Midwifery (GNM)',
      ],

      Undergraduate: [
        'B.Sc Nursing',
        'Post Basic B.Sc Nursing',
      ],

      Postgraduate: [
        'M.Sc Nursing',
        'M.Phil – Nursing',
        'PhD – Nursing',
      ],

      Diplomas: [
        'Diploma in Midwifery Nursing',
        'Diploma in Critical Care Nursing',
        'Diploma in Emergency & Disaster Nursing',
        'Diploma in Neonatal Nursing',
        'Diploma in Oncology Nursing',
        'Diploma in Psychiatric Nursing',
        'Diploma in Operation Room Nursing',
        'Diploma in Geriatric Nursing',
        'Diploma in Forensic Nursing',
      ],

      PractitionerPrograms: [
        'Nurse Practitioner in Critical Care',
      ],

      Specializations: [
        'MSc – Medical Surgical Nursing',
        'MSc – Child Health (Paediatric) Nursing',
        'MSc – Community Health Nursing',
        'MSc – Psychiatric Nursing',
        'MSc – Obstetrics & Gynaecological Nursing',
      ],
    },

    // 🦷 DENTAL
    dental: {
      Undergraduate: [
        'BDS – Bachelor of Dental Surgery',
      ],

      Postgraduate: [
        'MDS – Conservative Dentistry & Endodontics',
        'MDS – Oral & Maxillofacial Surgery',
        'MDS – Oral Medicine & Radiology',
        'MDS – Oral Pathology',
        'MDS – Orthodontics',
        'MDS – Pedodontics',
        'MDS – Periodontology',
        'MDS – Public Health Dentistry',
      ],
    },
  };

  const jobs = [
    {
      id: 1,
      title: 'Wanted MCh Neurosurgeon for Guntur',
      company: 'Hospital Jobs Doctors',
      category: 'Hospital Jobs Doctors',
      categoryKey: 'doctors',
      specialization: 'MCh – Neurosurgery',
      location: 'Guntur',
      salary: 'Rs. 400,000 - Rs. 600,000 / month',
      type: 'Full Time',
      featured: true,
    },
    {
      id: 2,
      title: 'Urgent Requirement: Radiologist - Vijayawada',
      company: 'Hospital Jobs Doctors',
      category: 'Hospital Jobs Doctors',
      categoryKey: 'doctors',
      specialization: 'MD – Radio-diagnosis',
      location: 'Vijayawada',
      salary: 'Rs. 500,000 - Rs. 600,000 / year',
      type: 'Full Time',
      featured: true,
    },
    {
      id: 3,
      title: 'Senior Cardiologist - Delhi',
      company: 'Apollo Hospitals',
      category: 'Hospital Jobs Doctors',
      categoryKey: 'doctors',
      specialization: 'DM – Cardiology',
      location: 'Delhi',
      salary: 'Rs. 800,000 - Rs. 1,200,000 / month',
      type: 'Full Time',
      featured: false,
    },
    {
      id: 4,
      title: 'Pediatrician - Mumbai',
      company: 'Max Healthcare',
      category: 'Hospital Jobs Doctors',
      categoryKey: 'doctors',
      specialization: 'MD – Paediatrics',
      location: 'Mumbai',
      salary: 'Rs. 600,000 - Rs. 900,000 / month',
      type: 'Full Time',
      featured: false,
    },
    {
      id: 5,
      title: 'Hospital Operations Manager',
      company: 'Fortis Healthcare',
      category: 'Hospital Management',
      categoryKey: 'management',
      specialization: 'Hospital Administration',
      location: 'Bangalore',
      salary: 'Rs. 250,000 - Rs. 400,000 / month',
      type: 'Full Time',
      featured: false,
    },
    {
      id: 6,
      title: 'Medical College Lecturer – Anatomy',
      company: 'AIIMS',
      category: 'Medical Colleges',
      categoryKey: 'colleges',
      specialization: 'MD – Anatomy',
      location: 'New Delhi',
      salary: 'Rs. 180,000 - Rs. 300,000 / month',
      type: 'Full Time',
      featured: true,
    },
    {
      id: 7,
      title: 'Physiotherapist',
      company: 'Manipal Hospitals',
      category: 'Allied Health',
      categoryKey: 'allied',
      specialization: 'BPT – Bachelor of Physiotherapy',
      location: 'Chennai',
      salary: 'Rs. 40,000 - Rs. 70,000 / month',
      type: 'Full Time',
      featured: false,
    },
    {
      id: 8,
      title: 'Dialysis Technician',
      company: 'Narayana Health',
      category: 'Allied Health',
      categoryKey: 'allied',
      specialization: 'Dialysis Technology',
      location: 'Hyderabad',
      salary: 'Rs. 35,000 - Rs. 55,000 / month',
      type: 'Full Time',
      featured: false,
    },
    {
      id: 9,
      title: 'Staff Nurse – ICU',
      company: 'Apollo Hospitals',
      category: 'Nursing',
      categoryKey: 'nursing',
      specialization: 'GNM – General Nursing and Midwifery',
      location: 'Coimbatore',
      salary: 'Rs. 30,000 - Rs. 50,000 / month',
      type: 'Full Time',
      featured: true,
    },
    {
      id: 10,
      title: 'Nursing Tutor',
      company: 'CMC Vellore',
      category: 'Nursing',
      categoryKey: 'nursing',
      specialization: 'B.Sc Nursing',
      location: 'Vellore',
      salary: 'Rs. 45,000 - Rs. 65,000 / month',
      type: 'Full Time',
      featured: false,
    },
    {
      id: 11,
      title: 'Ayurvedic Medical Officer',
      company: 'Kerala Ayurveda Ltd',
      category: 'Alternative Medicine',
      categoryKey: 'alternative',
      specialization: 'BAMS – Ayurveda',
      location: 'Kurnool',
      salary: 'Rs. 60,000 - Rs. 90,000 / month',
      type: 'Full Time',
      featured: false,
    },
    {
      id: 12,
      title: 'Homeopathy Consultant',
      company: 'Dr. Batra’s',
      category: 'Alternative Medicine',
      categoryKey: 'alternative',
      specialization: 'BHMS – Homeopathy',
      location: 'Mumbai',
      salary: 'Rs. 50,000 - Rs. 80,000 / month',
      type: 'Full Time',
      featured: true,
    },
    {
      id: 13,
      title: 'Dental Hygienist',
      company: 'Smile Dental Clinic',
      category: 'Dental',
      categoryKey: 'dental',
      specialization: 'BDS – Dental Hygiene',
      location: 'Hyderabad',
      salary: 'Rs. 25,000 - Rs. 40,000 / month',
      type: 'Full Time',
      featured: false,
    },
    {
      id: 14,
      title: 'Dental Assistant',
      company: 'Care Dental Hospital',
      category: 'Dental',
      categoryKey: 'dental',
      specialization: 'Dental Assisting',
      location: 'Vijayawada',
      salary: 'Rs. 18,000 - Rs. 28,000 / month',
      type: 'Full Time',
      featured: true,
    },
  ];

  const steps = [
    { id: 1, icon: '👤', title: 'Register an account', description: 'Create your professional profile in minutes.' },
    { id: 2, icon: '🔍', title: 'Search jobs', description: 'Explore thousands of verified healthcare jobs.' },
    { id: 3, icon: '📋', title: 'Apply easily', description: 'Apply instantly and connect with recruiters.' },
  ];

  const TOP_CATEGORIES_LIMIT = 3;

  const topCategoryKeys = Object.entries(
    jobs.reduce((acc, job) => {
      acc[job.categoryKey] = (acc[job.categoryKey] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_CATEGORIES_LIMIT)
    .map(([key]) => key);

  // ✅ Get degrees based on active tab
  const degrees =
  activeTab === 'latest'
    ? Array.from(
        new Set(
          Object.values(categorySpecializations)
            .flatMap(category => Object.keys(category))
        )
      )
    : categorySpecializations[activeTab]
      ? Object.keys(categorySpecializations[activeTab])
      : [];

  const specializations =
    categorySpecializations[activeTab]?.[selectedDegree] || [];

  const getSalaryValue = (salaryString) => {
    const numbers = salaryString?.match(/\d+/g);
    if (!numbers) return 0;
    return parseInt(numbers[0], 10);
  };

  const jobCities = [...new Set(jobs.map((job) => job.location))];

  const baseJobs =
    activeTab === 'latest'
      ? jobs.filter((job) => topCategoryKeys.includes(job.categoryKey))
      : jobs.filter((job) => job.categoryKey === activeTab);

  const filteredJobs = baseJobs.filter((job) => {
    const specializationMatch = filterSpecialization
      ? job.specialization === filterSpecialization
      : true;
    const cityMatch = filterCity ? job.location === filterCity : true;

    let salaryMatch = true;
    if (filterSalary) {
      const [min, max] = filterSalary.split('-').map(Number);
      const jobSalary = getSalaryValue(job.salary);
      salaryMatch = jobSalary >= min && jobSalary <= max;
    }

    return specializationMatch && cityMatch && salaryMatch;
  });

  const JOBS_PER_SLIDE = 2;
  const totalDots = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_SLIDE));

  const handlePrev = () => {
    if (totalDots <= 1) return;
    setActiveDot((prev) => (prev === 0 ? totalDots - 1 : prev - 1));
  };

  const handleNext = () => {
    if (totalDots <= 1) return;
    setActiveDot((prev) => (prev === totalDots - 1 ? 0 : prev + 1));
  };

  const validateQuickApply = () => {
    let errors = {};
    if (!quickApplyData.name.trim()) errors.name = 'Full Name is required';

    if (!quickApplyData.email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(quickApplyData.email)) errors.email = 'Invalid email format';

    if (!quickApplyData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[0-9]{6,15}$/.test(quickApplyData.phone)) errors.phone = 'Enter valid phone number';

    if (!quickApplyData.coverLetter.trim()) errors.coverLetter = 'Cover letter is required';

    if (!quickApplyData.resume) errors.resume = 'Resume is required';
    else {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(quickApplyData.resume.type)) errors.resume = 'Only PDF or Word files are allowed';
    }

    setQuickApplyErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateQuickPost = () => {
    let errors = {};
    if (!quickPostData.companyName.trim()) errors.companyName = 'Company name is required';

    if (!quickPostData.email.trim()) errors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(quickPostData.email)) errors.email = 'Invalid email format';

    if (!quickPostData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[0-9]{6,15}$/.test(quickPostData.phone)) errors.phone = 'Enter valid phone number';

    if (!quickPostData.jobTitle.trim()) errors.jobTitle = 'Job title is required';
    if (!quickPostData.location.trim()) errors.location = 'Location is required';
    if (!quickPostData.jobDescription.trim()) errors.jobDescription = 'Job description is required';

    setQuickPostErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCategoryClick = (categoryKey) => {
    setActiveTab(categoryKey);
    setActiveDot(0);
    setFilterSpecialization('');
    setFilterCity('');
    setFilterSalary('');

    setTimeout(() => {
      popularJobsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative min-h-[70vh] md:min-h-[75vh] lg:min-h-[50vh] w-full flex items-center justify-center overflow-hidden">

        {/* Background Image */}
        <img
          src="https://static.vecteezy.com/system/resources/previews/023/740/386/large_2x/medicine-doctor-with-stethoscope-in-hand-on-hospital-background-medical-technology-healthcare-and-medical-concept-photo.jpg"
          alt="Healthcare Jobs"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/75 to-cyan-600/70" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl px-4 py-12 md:py-20 text-center">

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            India's #1 Healthcare Job Platform
          </h1>

          {/* Search Form */}
<form
  onSubmit={handleSearch}
  className="w-full bg-white rounded-2xl md:rounded-full shadow-2xl p-4 md:p-1.5"
>
  <div className="flex flex-col md:flex-row items-stretch md:items-center">

    {/* Job Title */}
    <div className="flex-1 px-3 py-2 md:px-5 md:py-1.5 md:border-r border-gray-200">
      <input
        type="text"
        placeholder="Job title, keywords..."
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full outline-none text-gray-700 text-sm md:text-base"
      />
    </div>

    {/* City */}
    <div className="flex-1 px-3 py-2 md:px-5 md:py-1.5 md:border-r border-gray-200">
      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full outline-none bg-transparent text-gray-700 text-sm md:text-base"
      >
        <option value="">City</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>

    {/* Category */}
    <div className="flex-1 px-3 py-2 md:px-5 md:py-1.5 md:border-r border-gray-200">
      <select className="w-full outline-none bg-transparent text-gray-700 text-sm md:text-base">
        <option>All Categories</option>
        <option>Doctors</option>
        <option>Nursing</option>
        <option>Hospital Management</option>
        <option>Dental</option>
      </select>
    </div>

    {/* Button */}
    <div className="px-3 py-2 md:px-3 md:py-1.5">
      <button
        type="submit"
        className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 md:py-1.5 font-semibold rounded-full transition text-sm md:text-base"
      >
        Find Jobs
      </button>
    </div>
  </div>
</form>

          {/* Quick Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <button
              onClick={() => setShowQuickApplyModal(true)}
              className="bg-white text-cyan-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Quick Apply
            </button>

            <button
              onClick={() => setShowQuickPostModal(true)}
              className="border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-cyan-600 transition"
            >
              Quick Post Job
            </button>
          </div>

          {/* Browse Jobs */}
          <div className="text-white/90 mt-4 text-xs md:text-sm">
            <span className="font-semibold">Browse Jobs:</span>{' '}
            {browseItems.map((item, idx) => (
              <span key={item.value}>
                <button
                  type="button"
                  onClick={() => goToBrowse(item.value)}
                  className="underline underline-offset-2 hover:text-white font-medium"
                >
                  {item.label}
                </button>
                {idx !== browseItems.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Popular Job Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Popular Job Categories
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the most in-demand medical job categories on Mcare Jobs. Whether you're a doctor, nurse, lab
              technician, or medical assistant, find roles that match your skills and career goals in just a few clicks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.key)}
                className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{category.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-cyan-600 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {category.positions} open position{category.positions !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-cyan-500 group-hover:translate-x-1 transition-transform">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Most Popular Jobs */}
      <section ref={popularJobsRef} className="py-4 md:py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 md:mb-3">
              Most Popular Jobs
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              Discover the most in-demand medical job openings across India.
            </p>

            <p className="text-xs sm:text-sm md:text-base text-gray-500 mt-2 max-w-3xl mx-auto px-2 md:px-0">
              From top hospitals to specialized clinics, these roles are trending among healthcare professionals.
              Apply now to land your next opportunity with ease.
            </p>
          </div>

          {/* Categories */}
          <div className="relative flex items-center justify-center mb-6">

            {/* Left Arrow - Desktop Only */}
            {categoryIndex > 0 && (
              <button
                onClick={prevCategory}
                className="hidden md:block absolute left-0 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100"
              >
                ❮
              </button>
            )}

            {/* Tabs Container */}
            <div className="flex gap-3 overflow-x-auto md:overflow-hidden px-2 md:px-10 scroll-smooth no-scrollbar">

              {/* Mobile → show all tabs scrollable */}
              <div className="flex gap-3 md:hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setFilterSpecialization('');
                      setActiveDot(0);
                    }}
                    className={`flex-shrink-0 px-4 py-2 rounded-full border whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Desktop → sliced tabs with arrows */}
              <div className="hidden md:flex gap-3">
                {tabs.slice(categoryIndex, categoryIndex + visibleTabs).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setFilterSpecialization('');
                      setActiveDot(0);
                    }}
                    className={`px-5 py-2 rounded-full border whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Arrow - Desktop Only */}
            {categoryIndex + visibleTabs < tabs.length && (
              <button
                onClick={nextCategory}
                className="hidden md:block absolute right-0 z-10 bg-white shadow rounded-full p-2 hover:bg-gray-100"
              >
                ❯
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">

            <select
              value={selectedDegree}
              onChange={(e) => {
                setSelectedDegree(e.target.value);
                setFilterSpecialization('');
              }}
              className="border rounded-lg px-3 py-2 text-sm md:text-base"
            >
              <option value="">Select Degree</option>
              {degrees.map((deg) => (
                <option key={deg} value={deg}>{deg}</option>
              ))}
            </select>

            <select
              value={filterSpecialization}
              onChange={(e) => setFilterSpecialization(e.target.value)}
              disabled={!selectedDegree}
              className="border rounded-lg px-3 py-2 text-sm md:text-base"
            >
              <option value="">Select Specialization</option>
              {specializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select
              value={filterCity}
              onChange={(e) => {
                setFilterCity(e.target.value);
                setActiveDot(0);
              }}
              className="border rounded-lg px-3 py-2 text-sm md:text-base"
            >
              <option value="">All Cities</option>
              {jobCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterSalary}
              onChange={(e) => {
                setFilterSalary(e.target.value);
                setActiveDot(0);
              }}
              className="border rounded-lg px-3 py-2 text-sm md:text-base"
            >
              {salaryRanges.map((range) => (
                <option key={range.value || 'all'} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            <button
  onClick={() => {
    setSelectedDegree('');
    setFilterSpecialization('');
    setFilterCity('');
    setFilterSalary('');
  }}
  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition text-sm md:text-base"
>
  Clear Filters
</button>
          </div>

          {/* Jobs Section */}
{filteredJobs.length === 0 ? (
  <div className="text-center py-10 text-gray-500">
    No jobs found for selected filters.
  </div>
) : (
  <div className="relative">

    {/* ===== MOBILE VIEW (Swipe Cards) ===== */}
    <div className="flex md:hidden overflow-x-auto gap-4 px-1 no-scrollbar scroll-smooth">

      {filteredJobs.map((job) => (
        <div
          key={job.id}
          className="min-w-[85%] bg-white rounded-2xl shadow-lg border p-4 flex-shrink-0"
        >
          <h3 className="font-bold text-base">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600">{job.company}</p>
          <p className="text-sm">{job.location}</p>
          <p className="font-semibold mt-2">{job.salary}</p>

          <button
            onClick={() => handleApply(job)}
            className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded text-sm"
          >
            Apply Now
          </button>
        </div>
      ))}

    </div>

    {/* ===== DESKTOP VIEW (Slider with Arrows) ===== */}
    <div className="hidden md:block overflow-hidden relative">

      {/* Desktop Arrows Only */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition"
      >
        ‹
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-100 transition"
      >
        ›
      </button>

      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${activeDot * 100}%)` }}
      >
        {Array.from({ length: totalDots }).map((_, slideIndex) => (
          <div
            key={slideIndex}
            className="min-w-full grid grid-cols-2 gap-6 px-1"
          >
            {filteredJobs
              .slice(slideIndex * 2, slideIndex * 2 + 2)
              .map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl shadow-lg border p-6"
                >
                  <h3 className="font-bold text-lg">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-sm">{job.location}</p>
                  <p className="font-semibold mt-2">{job.salary}</p>

                  <button
                    onClick={() => handleApply(job)}
                    className="mt-4 bg-cyan-500 text-white px-4 py-2 rounded"
                  >
                    Apply Now
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>

    </div>
  </div>
)}

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {Array.from({ length: totalDots }).map((_, dot) => (
              <button
                key={dot}
                onClick={() => setActiveDot(dot)}
                className={`w-3 h-3 rounded-full ${
                  activeDot === dot ? 'bg-cyan-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* How It Works */}
<section className="py-12 md:py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="text-center mb-8 md:mb-12">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
        How It Works?
      </h2>

      <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-3 md:mb-4 max-w-3xl mx-auto px-2 md:px-0">
        Mcare Jobs makes it simple for medical professionals to find the right job and for hospitals to hire the right
        talent. Whether you're a doctor, nurse, technician, or recruiter – getting started is easy.
      </p>
    </div>

    {/* Steps */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {steps.map((step) => (
        <div key={step.id} className="text-center px-2 md:px-0">
          <div className="mb-3 md:mb-4 flex justify-center">
            <div className="text-4xl md:text-6xl">
              {step.icon}
            </div>
          </div>

          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
            {step.title}
          </h3>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            {step.description}
          </p>
        </div>
      ))}
    </div>

  </div>
</section>

      {/* Trusted Hospitals */}
<section className="py-12 md:py-16 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    {/* Header */}
    <div className="text-center mb-8 md:mb-10">
      <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900">
        Trusted by Leading Hospitals
      </h2>

      <p className="text-sm sm:text-base md:text-base text-gray-600 mt-2">
        We work with India’s top healthcare institutions
      </p>
    </div>

    <div className="relative flex items-center">

      {/* LEFT ARROW – Desktop Only */}
      <button
        onClick={handleLogoPrev}
        className="hidden md:block absolute left-0 z-10 bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-lg"
      >
        ‹
      </button>

      {/* ===== MOBILE VIEW (Swipe) ===== */}
      <div className="flex md:hidden overflow-x-auto gap-8 no-scrollbar scroll-smooth px-2">
        {hospitalLogos.map((logo, i) => (
          <img
            key={i}
            src={logo}
            alt="Hospital Logo"
            className="h-14 flex-shrink-0 object-contain grayscale hover:grayscale-0 transition"
          />
        ))}
      </div>

      {/* ===== DESKTOP VIEW (Slider with Arrows) ===== */}
      <div className="hidden md:block overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${logoIndex * 100}%)` }}
        >
          {Array.from({
            length: Math.ceil(hospitalLogos.length / LOGOS_PER_SLIDE),
          }).map((_, slideIdx) => (
            <div
              key={slideIdx}
              className="min-w-full flex justify-center items-center gap-12"
            >
              {hospitalLogos
                .slice(
                  slideIdx * LOGOS_PER_SLIDE,
                  slideIdx * LOGOS_PER_SLIDE + LOGOS_PER_SLIDE
                )
                .map((logo, i) => (
                  <img
                    key={i}
                    src={logo}
                    alt="Hospital Logo"
                    className="h-20 object-contain grayscale hover:grayscale-0 transition"
                  />
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT ARROW – Desktop Only */}
      <button
        onClick={handleLogoNext}
        className="hidden md:block absolute right-0 z-10 bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-lg"
      >
        ›
      </button>

    </div>

  </div>
</section>

      {/* CTA Section */}
<section className="py-12 md:py-16 bg-gradient-to-r from-cyan-500 to-blue-600">
  <div className="max-w-4xl mx-auto text-center px-4">

    {/* Heading */}
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
      Ready to Start Your Healthcare Career?
    </h2>

    {/* Description */}
    <p className="text-sm sm:text-base md:text-lg text-cyan-100 mb-6 md:mb-8">
      Join thousands of healthcare professionals finding their perfect job match
    </p>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">

      <Link
        to="/register"
        className="bg-white text-cyan-600 px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-gray-100 font-medium text-sm md:text-base inline-flex items-center justify-center transition shadow-lg"
      >
        <span>Create Free Account</span>
      </Link>

      <Link
        to="/jobs"
        className="bg-transparent border-2 border-white text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-white hover:text-cyan-600 font-medium text-sm md:text-base transition shadow-lg"
      >
        Browse Jobs
      </Link>

    </div>

  </div>
</section>

      {/* Footer */}
<footer className="bg-gray-900 text-gray-300 py-8 md:py-12 px-4">
  <div className="max-w-7xl mx-auto">

    {/* Main Grid */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-8">

      {/* Logo Section */}
      <div>
        <div className="flex items-center space-x-2 mb-3 md:mb-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg md:text-xl">M</span>
          </div>
          <span className="text-lg md:text-2xl font-bold text-white">MCARE</span>
        </div>
        <p className="text-gray-400 text-sm md:text-base">
          Your trusted partner in healthcare recruitment
        </p>
      </div>

      {/* Categories Wrapper */}
      <div className="md:col-span-3">

        <div className="grid grid-cols-3 md:grid-cols-3 gap-6 md:gap-8 text-center md:text-left">

          {/* For Candidates */}
          <div>
            <h3 className="text-white font-semibold mb-2 md:mb-4 text-sm md:text-base">
              For Candidates
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link to="/jobs" className="hover:text-cyan-400 transition">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-cyan-400 transition">Create Account</Link></li>
              <li><Link to="/login" className="hover:text-cyan-400 transition">Sign In</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-white font-semibold mb-2 md:mb-4 text-sm md:text-base">
              For Employers
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link to="/register" className="hover:text-cyan-400 transition">Post a Job</Link></li>
              <li><Link to="/login" className="hover:text-cyan-400 transition">Employer Login</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-2 md:mb-4 text-sm md:text-base">
              Company
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link to="/about" className="hover:text-cyan-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition">Contact</Link></li>
            </ul>
          </div>

        </div>

      </div>
    </div>

    {/* Bottom */}
    <div className="border-t border-gray-800 pt-6 md:pt-8 text-center text-gray-400 text-xs md:text-sm">
      <p>&copy; 2025 MCARE. All rights reserved.</p>
    </div>

  </div>
</footer>

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title={`Apply for ${selectedJob.title}`}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter</label>
              <textarea
                rows="6"
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                placeholder="Tell us why you're a great fit for this role..."
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
              <input
                type="text"
                value={applicationData.expectedSalary}
                onChange={(e) => setApplicationData({ ...applicationData, expectedSalary: e.target.value })}
                placeholder="Rs. 50,000"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available to Join</label>
              <input
                type="date"
                value={applicationData.availability}
                onChange={(e) => setApplicationData({ ...applicationData, availability: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button onClick={() => setShowApplyModal(false)} className="px-6 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
              >
                Submit Application
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Success">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <p className="text-lg text-gray-900">{successMessage}</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Quick Apply Modal */}
      {showQuickApplyModal && (
        <Modal
          isOpen={showQuickApplyModal}
          onClose={() => setShowQuickApplyModal(false)}
          title="Quick Apply (No Registration Required)"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Candidate Information</h3>
              <p className="text-sm text-gray-500">Fill in your details to apply instantly</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={quickApplyData.name}
                onChange={(e) => setQuickApplyData({ ...quickApplyData, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              {quickApplyErrors.name && <p className="text-red-500 text-sm mt-1">{quickApplyErrors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={quickApplyData.email}
                onChange={(e) => setQuickApplyData({ ...quickApplyData, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              {quickApplyErrors.email && <p className="text-red-500 text-sm mt-1">{quickApplyErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">
                <select
                  value={quickApplyData.countryCode}
                  onChange={(e) => setQuickApplyData({ ...quickApplyData, countryCode: e.target.value })}
                  className="w-32 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  value={quickApplyData.phone}
                  onChange={(e) => setQuickApplyData({ ...quickApplyData, phone: e.target.value })}
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter phone number"
                />
              </div>

              {quickApplyErrors.phone && <p className="text-red-500 text-sm mt-1">{quickApplyErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Letter <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="4"
                value={quickApplyData.coverLetter}
                onChange={(e) => setQuickApplyData({ ...quickApplyData, coverLetter: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              {quickApplyErrors.coverLetter && <p className="text-red-500 text-sm mt-1">{quickApplyErrors.coverLetter}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume *</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setQuickApplyData({ ...quickApplyData, resume: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              {quickApplyErrors.resume && <p className="text-red-500 text-sm mt-1">{quickApplyErrors.resume}</p>}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => navigate('/register')} className="text-cyan-600 font-medium">
                Register Instead
              </button>

              <button
                onClick={() => {
                  if (validateQuickApply()) {
                    setShowQuickApplyModal(false);
                    setSuccessMessage('Quick application submitted successfully!');
                    setShowSuccessModal(true);

                    setQuickApplyData({
                      name: '',
                      email: '',
                      countryCode: '+91',
                      phone: '',
                      coverLetter: '',
                      resume: null,
                    });

                    setQuickApplyErrors({});
                  }
                }}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Quick Post Job Modal */}
      {showQuickPostModal && (
        <Modal
          isOpen={showQuickPostModal}
          onClose={() => setShowQuickPostModal(false)}
          title="Quick Post Job (No Registration Required)"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Employer Information</h3>
              <p className="text-sm text-gray-500">Post your job quickly without creating an account</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={quickPostData.companyName}
                onChange={(e) => setQuickPostData({ ...quickPostData, companyName: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              {quickPostErrors.companyName && <p className="text-red-500 text-sm mt-1">{quickPostErrors.companyName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Official Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={quickPostData.email}
                onChange={(e) => setQuickPostData({ ...quickPostData, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              {quickPostErrors.email && <p className="text-red-500 text-sm mt-1">{quickPostErrors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>

              <div className="flex gap-2">
                <select
                  value={quickPostData.countryCode}
                  onChange={(e) => setQuickPostData({ ...quickPostData, countryCode: e.target.value })}
                  className="w-32 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  value={quickPostData.phone}
                  onChange={(e) => setQuickPostData({ ...quickPostData, phone: e.target.value })}
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter phone number"
                />
              </div>

              {quickPostErrors.phone && <p className="text-red-500 text-sm mt-1">{quickPostErrors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={quickPostData.jobTitle}
                onChange={(e) => setQuickPostData({ ...quickPostData, jobTitle: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              {quickPostErrors.jobTitle && <p className="text-red-500 text-sm mt-1">{quickPostErrors.jobTitle}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={quickPostData.location}
                onChange={(e) => setQuickPostData({ ...quickPostData, location: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              />
              {quickPostErrors.location && <p className="text-red-500 text-sm mt-1">{quickPostErrors.location}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>

              <textarea
                rows="4"
                value={quickPostData.jobDescription}
                onChange={(e) => setQuickPostData({ ...quickPostData, jobDescription: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="Enter job responsibilities, required skills, experience, etc."
              />

              {quickPostErrors.jobDescription && <p className="text-red-500 text-sm mt-1">{quickPostErrors.jobDescription}</p>}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => navigate('/register')} className="text-cyan-600 font-medium">
                Register Instead
              </button>

              <button
                onClick={() => {
                  if (validateQuickPost()) {
                    setShowQuickPostModal(false);
                    setSuccessMessage('Job posted successfully!');
                    setShowSuccessModal(true);

                    setQuickPostData({
                      companyName: '',
                      contactPerson: '',
                      email: '',
                      countryCode: '+91',
                      phone: '',
                      jobTitle: '',
                      location: '',
                      jobDescription: '',
                    });

                    setQuickPostErrors({});
                  }
                }}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
              >
                Submit Job
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;