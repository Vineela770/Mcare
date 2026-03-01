import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Modal from '../../components/common/Modal';
import { CheckCircle, Stethoscope, Building2, GraduationCap, Activity, Heart, Leaf, Smile, UserPlus, Search, FileCheck, ChevronLeft, ChevronRight } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import jobService from '../../api/jobService';

// ✅ STATIC DEMO DATA - For display purposes only
const DUMMY_JOBS = [
  // DOCTORS - 15 positions
  { id: 1, title: 'Senior Cardiologist', company: 'Apollo Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹35,00,000 – ₹55,00,000', categoryKey: 'doctors', category: 'Cardiology', specialization: 'DM – Cardiology', description: 'Seeking experienced cardiologist for interventional procedures. State-of-the-art cath lab available.', requirements: 'DM Cardiology, 5+ years experience, interventional skills', is_active: true },
  { id: 2, title: 'General Surgeon', company: 'Apollo Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹20,00,000 – ₹30,00,000', categoryKey: 'doctors', category: 'Surgery', specialization: 'MS – General Surgery', description: 'Skilled general surgeon for elective and emergency procedures', requirements: 'MS General Surgery, 3+ years', is_active: true },
  { id: 3, title: 'Paediatric Consultant', company: 'Fortis Healthcare', location: 'Bangalore', city: 'Bangalore', salary: '₹18,00,000 – ₹26,00,000', categoryKey: 'doctors', category: 'Paediatrics', specialization: 'MD – Paediatrics', description: 'Manage inpatient and outpatient paediatric cases in well-equipped children hospital', requirements: 'MD Paediatrics, 3+ years clinical experience', is_active: true },
  { id: 4, title: 'Orthopaedic Surgeon', company: 'Fortis Healthcare', location: 'Bangalore', city: 'Bangalore', salary: '₹28,00,000 – ₹40,00,000', categoryKey: 'doctors', category: 'Orthopaedics', specialization: 'MS – Orthopaedics', description: 'Joint replacement and sports medicine specialist needed', requirements: 'MS Orthopaedics, 5+ years experience', is_active: true },
  { id: 5, title: 'Neurosurgeon', company: 'Manipal Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹45,00,000 – ₹70,00,000', categoryKey: 'doctors', category: 'Neurosurgery', specialization: 'MCh – Neurosurgery', description: 'Lead complex brain and spine surgical programmes', requirements: 'MCh Neurosurgery, 7+ years experience', is_active: true },
  { id: 6, title: 'Radiologist', company: 'Manipal Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹22,00,000 – ₹32,00,000', categoryKey: 'doctors', category: 'Radiology', specialization: 'MD – Radiodiagnosis', description: 'Expert diagnostic radiologist for imaging department', requirements: 'MD Radiology, 3+ years experience', is_active: true },
  { id: 7, title: 'Junior Resident – General Medicine', company: 'AIIMS Hyderabad', location: 'Hyderabad', city: 'Hyderabad', salary: '₹75,000 – ₹90,000', categoryKey: 'doctors', category: 'General Medicine', specialization: 'MBBS', description: 'Residential program with rotations through subspecialties', requirements: 'MBBS, MCI registration, NEET-PG cleared', is_active: true },
  { id: 8, title: 'Senior Resident – Psychiatry', company: 'AIIMS Hyderabad', location: 'Hyderabad', city: 'Hyderabad', salary: '₹90,000 – ₹1,10,000', categoryKey: 'doctors', category: 'Psychiatry', specialization: 'MD – Psychiatry', description: 'Senior resident for mental health department', requirements: 'MD Psychiatry, NMC registration', is_active: true },
  { id: 9, title: 'Consultant Dermatologist', company: 'Max Healthcare', location: 'Delhi', city: 'Delhi', salary: '₹25,00,000 – ₹35,00,000', categoryKey: 'doctors', category: 'Dermatology', specialization: 'MD – Dermatology, Venereology & Leprosy', description: 'Looking for experienced dermatologist for cosmetic and clinical dermatology', requirements: 'MD/DNB Dermatology, 4+ years experience', is_active: true },
  { id: 10, title: 'Anaesthesiologist', company: 'Narayana Health', location: 'Bangalore', city: 'Bangalore', salary: '₹20,00,000 – ₹28,00,000', categoryKey: 'doctors', category: 'Anaesthesiology', specialization: 'MD – Anaesthesiology', description: 'Critical care and operation theatre anaesthesia specialist', requirements: 'MD Anaesthesia, 3+ years OT experience', is_active: true },
  { id: 11, title: 'Emergency Medicine Physician', company: 'Medanta Hospital', location: 'Gurgaon', city: 'Gurgaon', salary: '₹18,00,000 – ₹24,00,000', categoryKey: 'doctors', category: 'Emergency Medicine', specialization: 'MD – Emergency Medicine', description: 'Handle emergency trauma cases in 24x7 ER department', requirements: 'MD Emergency Medicine, ATLS certified', is_active: true },
  { id: 12, title: 'Gynaecologist', company: 'Cloudnine Hospitals', location: 'Mumbai', city: 'Mumbai', salary: '₹30,00,000 – ₹45,00,000', categoryKey: 'doctors', category: 'Obstetrics & Gynaecology', specialization: 'MS – Obstetrics & Gynaecology', description: 'Expert in high-risk pregnancies and reproductive health', requirements: 'MS/DNB OBG, 5+ years experience', is_active: true },
  { id: 13, title: 'Endocrinologist', company: 'Kokilaben Hospital', location: 'Mumbai', city: 'Mumbai', salary: '₹28,00,000 – ₹38,00,000', categoryKey: 'doctors', category: 'Endocrinology', specialization: 'DM – Endocrinology', description: 'Manage diabetes, thyroid and hormonal disorders', requirements: 'DM Endocrinology, 3+ years', is_active: true },
  { id: 14, title: 'Pulmonologist', company: 'Yashoda Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹22,00,000 – ₹32,00,000', categoryKey: 'doctors', category: 'Pulmonology', specialization: 'DM – Pulmonary Medicine', description: 'Expert in respiratory diseases and critical pulmonology', requirements: 'DM Pulmonary Medicine, bronchoscopy skills', is_active: true },
  { id: 15, title: 'Nephrologist', company: 'KIMS Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹24,00,000 – ₹35,00,000', categoryKey: 'doctors', category: 'Nephrology', specialization: 'DM – Nephrology', description: 'Dialysis and kidney disease management specialist', requirements: 'DM Nephrology, transplant experience preferred', is_active: true },
  
  // NURSING - 12 positions
  { id: 16, title: 'Senior Nurse – ICU', company: 'MCARE Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹4,00,000 – ₹6,00,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'B.Sc Nursing', description: 'Experienced ICU nurses for critical care. 12-hour shifts.', requirements: 'BSc/GNM Nursing, 3+ years ICU experience, BLS/ACLS', is_active: true },
  { id: 17, title: 'Staff Nurse – General Ward', company: 'Apollo Hospitals', location: 'Chennai', city: 'Chennai', salary: '₹3,00,000 – ₹4,50,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'GNM', description: 'General nursing duties in multi-specialty hospital', requirements: 'GNM/BSc Nursing, 1+ year experience', is_active: true },
  { id: 18, title: 'Operation Theatre Nurse', company: 'Fortis Healthcare', location: 'Delhi', city: 'Delhi', salary: '₹3,50,000 – ₹5,00,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'B.Sc Nursing', description: 'OT nurse for surgical procedures assistance', requirements: 'BSc Nursing, OT experience 2+ years', is_active: true },
  { id: 19, title: 'Pediatric Nurse', company: 'Rainbow Children Hospital', location: 'Bangalore', city: 'Bangalore', salary: '₹3,50,000 – ₹5,50,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'B.Sc Nursing', description: 'Specialized pediatric nursing care', requirements: 'BSc Nursing, pediatric experience preferred', is_active: true },
  { id: 20, title: 'Critical Care Nurse', company: 'Narayana Health', location: 'Bangalore', city: 'Bangalore', salary: '₹4,50,000 – ₹6,50,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'B.Sc Nursing', description: 'CICU/NICU critical care nursing', requirements: 'BSc Nursing, critical care certification, 3+ years', is_active: true },
  { id: 21, title: 'Emergency Nurse', company: 'Max Healthcare', location: 'Delhi', city: 'Delhi', salary: '₹3,80,000 – ₹5,50,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'B.Sc Nursing', description: 'Emergency department trauma care nurse', requirements: 'BSc Nursing, emergency experience, BLS certified', is_active: true },
  { id: 22, title: 'Dialysis Nurse', company: 'Manipal Hospitals', location: 'Bangalore', city: 'Bangalore', salary: '₹3,20,000 – ₹4,80,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'GNM', description: 'Dialysis unit nursing care specialist', requirements: 'GNM/BSc Nursing, dialysis experience', is_active: true },
  { id: 23, title: 'Oncology Nurse', company: 'Tata Memorial Hospital', location: 'Mumbai', city: 'Mumbai', salary: '₹4,00,000 – ₹6,00,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'B.Sc Nursing', description: 'Cancer care and chemotherapy administration', requirements: 'BSc Nursing, oncology certification preferred', is_active: true },
  { id: 24, title: 'Cardiac Nurse', company: 'Narayana Health', location: 'Bangalore', city: 'Bangalore', salary: '₹4,20,000 – ₹6,20,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'B.Sc Nursing', description: 'CCU cardiac nursing specialist', requirements: 'BSc Nursing, cardiac care experience, ACLS', is_active: true },
  { id: 25, title: 'NICU Nurse', company: 'Cloudnine Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹3,80,000 – ₹5,80,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'B.Sc Nursing', description: 'Neonatal intensive care specialist', requirements: 'BSc Nursing, NICU experience, NRP certified', is_active: true },
  { id: 26, title: 'Nursing Supervisor', company: 'Yashoda Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹5,00,000 – ₹7,50,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'M.Sc Nursing', description: 'Supervise nursing staff and ensure quality care', requirements: 'MSc Nursing, 5+ years experience', is_active: true },
  { id: 27, title: 'Community Health Nurse', company: 'Apollo Hospitals', location: 'Chennai', city: 'Chennai', salary: '₹2,80,000 – ₹4,20,000', categoryKey: 'nursing', category: 'Nursing', specialization: 'GNM', description: 'Community outreach and health education', requirements: 'GNM/BSc Nursing, field experience', is_active: true },
  
  // ALLIED HEALTH - 12 positions
  { id: 28, title: 'Medical Lab Technician', company: 'MCARE Diagnostics', location: 'Bangalore', city: 'Bangalore', salary: '₹3,00,000 – ₹4,50,000', categoryKey: 'allied', category: 'Pathology', specialization: 'BMLT/DMLT', description: 'Lab technician for diagnostic centre', requirements: 'BMLT/DMLT, 2+ years experience', is_active: true },
  { id: 29, title: 'Physiotherapist', company: 'MCARE Rehab', location: 'Chennai', city: 'Chennai', salary: '₹3,50,000 – ₹5,00,000', categoryKey: 'allied', category: 'Rehabilitation', specialization: 'BPT', description: 'Rehabilitation physiotherapy specialist', requirements: 'BPT/MPT, 1+ year clinical experience', is_active: true },
  { id: 30, title: 'Radiographer', company: 'Apollo Imaging', location: 'Hyderabad', city: 'Hyderabad', salary: '₹2,80,000 – ₹4,00,000', categoryKey: 'allied', category: 'Radiology Tech', specialization: 'Diploma in Medical Radiological Technology (DMRT)', description: 'X-Ray and CT scan technician', requirements: 'DMRT certification, 2+ years', is_active: true },
  { id: 31, title: 'Pharmacist', company: 'Fortis Pharmacy', location: 'Mumbai', city: 'Mumbai', salary: '₹3,00,000 – ₹4,50,000', categoryKey: 'allied', category: 'Pharmacy', specialization: 'B.Pharm', description: 'Hospital pharmacy operations and patient counseling', requirements: 'B.Pharm, registered pharmacist', is_active: true },
  { id: 32, title: 'Nutritionist', company: 'Max Healthcare', location: 'Delhi', city: 'Delhi', salary: '₹3,50,000 – ₹5,00,000', categoryKey: 'allied', category: 'Nutrition', specialization: 'M.Sc Nutrition and Dietetics', description: 'Clinical nutritionist for patient diet planning', requirements: 'MSc Nutrition/Dietetics, 2+ years', is_active: true },
  { id: 33, title: 'Occupational Therapist', company: 'Manipal Hospitals', location: 'Bangalore', city: 'Bangalore', salary: '₹3,20,000 – ₹4,80,000', categoryKey: 'allied', category: 'Therapy', specialization: 'BOT', description: 'Occupational therapy for rehabilitation', requirements: 'BOT/MOT, 1+ year experience', is_active: true },
  { id: 34, title: 'MRI Technician', company: 'Narayana Health', location: 'Bangalore', city: 'Bangalore', salary: '₹3,20,000 – ₹4,80,000', categoryKey: 'allied', category: 'Radiology Tech', specialization: 'Diploma in Medical Radiological Technology (DMRT)', description: 'MRI scanning and imaging specialist', requirements: 'DMRT/BSc Radiology, MRI certification', is_active: true },
  { id: 35, title: 'CT Scan Technician', company: 'Yashoda Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹3,00,000 – ₹4,50,000', categoryKey: 'allied', category: 'Radiology Tech', specialization: 'Diploma in Medical Radiological Technology (DMRT)', description: 'CT scanning and image processing', requirements: 'DMRT, CT scan experience', is_active: true },
  { id: 36, title: 'Clinical Psychologist', company: 'Manipal Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹4,00,000 – ₹6,00,000', categoryKey: 'allied', category: 'Mental Health', specialization: 'M.Phil Clinical Psychology', description: 'Psychological assessments and counseling', requirements: 'M.Phil/PhD Clinical Psychology, RCI registered', is_active: true },
  { id: 37, title: 'Speech Therapist', company: 'Apollo Hospitals', location: 'Chennai', city: 'Chennai', salary: '₹3,00,000 – ₹4,50,000', categoryKey: 'allied', category: 'Therapy', specialization: 'BASLP/MASLP', description: 'Speech and language therapy services', requirements: 'BASLP/MASLP, 1+ year experience', is_active: true },
  { id: 38, title: 'Dialysis Technician', company: 'Max Healthcare', location: 'Delhi', city: 'Delhi', salary: '₹2,80,000 – ₹4,00,000', categoryKey: 'allied', category: 'Nephrology Tech', specialization: 'Diploma in Dialysis Technology', description: 'Operate dialysis equipment and patient monitoring', requirements: 'Dialysis technology diploma, 1+ year', is_active: true },
  { id: 39, title: 'Optometrist', company: 'LV Prasad Eye Institute', location: 'Hyderabad', city: 'Hyderabad', salary: '₹3,20,000 – ₹4,80,000', categoryKey: 'allied', category: 'Ophthalmology', specialization: 'B.Optom', description: 'Eye examination and vision testing', requirements: 'B.Optom, 2+ years clinical experience', is_active: true },
  
  // MANAGEMENT - 12 positions
  { id: 40, title: 'Hospital Administrator', company: 'MCARE Management', location: 'Hyderabad', city: 'Hyderabad', salary: '₹8,00,000 – ₹12,00,000', categoryKey: 'management', category: 'Administration', specialization: 'MBA Healthcare', description: 'Oversee hospital operations and compliance', requirements: 'MBA Healthcare, 5+ years administration', is_active: true },
  { id: 41, title: 'Medical Billing Manager', company: 'Apollo Hospitals', location: 'Chennai', city: 'Chennai', salary: '₹6,00,000 – ₹9,00,000', categoryKey: 'management', category: 'Finance', specialization: 'MBA/B.Com', description: 'Manage medical billing and insurance claims', requirements: '5+ years in healthcare billing', is_active: true },
  { id: 42, title: 'Quality Manager', company: 'Fortis Healthcare', location: 'Bangalore', city: 'Bangalore', salary: '₹7,00,000 – ₹10,00,000', categoryKey: 'management', category: 'Quality Assurance', specialization: 'MHA/MBA Healthcare', description: 'NABH accreditation and quality standards', requirements: 'MBA, NABH auditor experience', is_active: true },
  { id: 43, title: 'HR Manager – Healthcare', company: 'Narayana Health', location: 'Bangalore', city: 'Bangalore', salary: '₹6,50,000 – ₹9,50,000', categoryKey: 'management', category: 'Human Resources', specialization: 'MBA HR', description: 'Healthcare recruitment and staff management', requirements: 'MBA HR, 4+ years in healthcare', is_active: true },
  { id: 44, title: 'Operations Manager', company: 'Max Healthcare', location: 'Delhi', city: 'Delhi', salary: '₹8,00,000 – ₹12,00,000', categoryKey: 'management', category: 'Operations', specialization: 'MHA/MBA', description: 'Hospital operations and process optimization', requirements: 'MBA/MHA, 5+ years operations', is_active: true },
  { id: 45, title: 'Front Office Manager', company: 'Manipal Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹4,00,000 – ₹6,00,000', categoryKey: 'management', category: 'Administration', specialization: 'MBA/BBA', description: 'Manage front desk and patient services', requirements: 'MBA/BBA, 3+ years in healthcare', is_active: true },
  { id: 46, title: 'Finance Manager', company: 'Yashoda Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹7,00,000 – ₹10,00,000', categoryKey: 'management', category: 'Finance', specialization: 'MBA Finance/CA', description: 'Financial planning and accounting management', requirements: 'MBA Finance/CA, 4+ years', is_active: true },
  { id: 47, title: 'Marketing Manager – Healthcare', company: 'Cloudnine Hospitals', location: 'Mumbai', city: 'Mumbai', salary: '₹6,00,000 – ₹9,00,000', categoryKey: 'management', category: 'Marketing', specialization: 'MBA Marketing', description: 'Healthcare marketing and brand management', requirements: 'MBA Marketing, 3+ years in healthcare', is_active: true },
  { id: 48, title: 'Biomedical Engineer', company: 'Fortis Healthcare', location: 'Bangalore', city: 'Bangalore', salary: '₹5,00,000 – ₹7,50,000', categoryKey: 'management', category: 'Engineering', specialization: 'B.Tech Biomedical Engineering', description: 'Medical equipment maintenance and management', requirements: 'B.Tech Biomedical, 2+ years', is_active: true },
  { id: 49, title: 'Medical Records Officer', company: 'Apollo Hospitals', location: 'Chennai', city: 'Chennai', salary: '₹3,50,000 – ₹5,00,000', categoryKey: 'management', category: 'Health Information', specialization: 'B.Sc/BBA', description: 'Manage patient medical records and data', requirements: 'B.Sc/BBA, EMR experience', is_active: true },
  { id: 50, title: 'Facility Manager', company: 'Narayana Health', location: 'Bangalore', city: 'Bangalore', salary: '₹6,00,000 – ₹9,00,000', categoryKey: 'management', category: 'Facility Management', specialization: 'B.Tech/MBA', description: 'Hospital infrastructure and facility management', requirements: 'B.Tech/MBA, 4+ years facility management', is_active: true },
  { id: 51, title: 'Purchase Manager', company: 'Manipal Hospitals', location: 'Hyderabad', city: 'Hyderabad', salary: '₹5,50,000 – ₹8,00,000', categoryKey: 'management', category: 'Supply Chain', specialization: 'MBA/B.Com', description: 'Medical supplies and equipment procurement', requirements: 'MBA/B.Com, 3+ years healthcare purchasing', is_active: true },
  
  // DENTAL - 12 positions
  { id: 52, title: 'General Dentist', company: 'Apollo White Dental', location: 'Hyderabad', city: 'Hyderabad', salary: '₹6,00,000 – ₹10,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'BDS', description: 'General dental practice and patient care', requirements: 'BDS, 2+ years clinical experience', is_active: true },
  { id: 53, title: 'Orthodontist', company: 'Clove Dental', location: 'Delhi', city: 'Delhi', salary: '₹8,00,000 – ₹15,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'MDS – Orthodontics', description: 'Braces and orthodontic treatment specialist', requirements: 'MDS Orthodontics, 3+ years', is_active: true },
  { id: 54, title: 'Oral Surgeon', company: 'Manipal Dental', location: 'Bangalore', city: 'Bangalore', salary: '₹10,00,000 – ₹18,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'MDS – Oral & Maxillofacial Surgery', description: 'Oral surgery and maxillofacial procedures', requirements: 'MDS Oral Surgery, 4+ years', is_active: true },
  { id: 55, title: 'Endodontist', company: 'FMS Dental', location: 'Hyderabad', city: 'Hyderabad', salary: '₹7,00,000 – ₹12,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'MDS – Conservative Dentistry & Endodontics', description: 'Root canal treatment specialist', requirements: 'MDS Endodontics, 2+ years', is_active: true },
  { id: 56, title: 'Periodontist', company: 'Sabka Dentist', location: 'Mumbai', city: 'Mumbai', salary: '₹7,50,000 – ₹13,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'MDS – Periodontics', description: 'Gum disease treatment and dental implants', requirements: 'MDS Periodontics, 3+ years', is_active: true },
  { id: 57, title: 'Pediatric Dentist', company: 'Kidzee Dental', location: 'Bangalore', city: 'Bangalore', salary: '₹6,50,000 – ₹11,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'MDS – Pedodontics', description: 'Children dental care specialist', requirements: 'MDS Pedodontics, 2+ years', is_active: true },
  { id: 58, title: 'Prosthodontist', company: 'Apollo White Dental', location: 'Chennai', city: 'Chennai', salary: '₹8,00,000 – ₹14,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'MDS – Prosthodontics', description: 'Dentures and dental prosthetics specialist', requirements: 'MDS Prosthodontics, 3+ years', is_active: true },
  { id: 59, title: 'Dental Hygienist', company: 'Clove Dental', location: 'Delhi', city: 'Delhi', salary: '₹2,50,000 – ₹4,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'BDS', description: 'Dental cleaning and hygiene services', requirements: 'BDS/Dental Hygiene certification', is_active: true },
  { id: 60, title: 'Cosmetic Dentist', company: 'Smile Dental Clinic', location: 'Mumbai', city: 'Mumbai', salary: '₹9,00,000 – ₹16,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'MDS', description: 'Cosmetic dentistry and smile makeovers', requirements: 'MDS, cosmetic dentistry certification', is_active: true },
  { id: 61, title: 'Dental Surgeon', company: 'Manipal Dental', location: 'Bangalore', city: 'Bangalore', salary: '₹7,00,000 – ₹12,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'BDS/MDS', description: 'General dental surgery and extractions', requirements: 'BDS/MDS, 2+ years surgical experience', is_active: true },
  { id: 62, title: 'Implantologist', company: 'FMS Dental', location: 'Hyderabad', city: 'Hyderabad', salary: '₹10,00,000 – ₹18,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'MDS – Periodontics', description: 'Dental implant placement specialist', requirements: 'MDS, implantology certification, 3+ years', is_active: true },
  { id: 63, title: 'Dental Radiologist', company: 'Apollo Dental', location: 'Chennai', city: 'Chennai', salary: '₹6,00,000 – ₹9,00,000', categoryKey: 'dental', category: 'Dental', specialization: 'MDS – Oral Medicine & Radiology', description: 'Dental imaging and diagnostic radiology', requirements: 'MDS Oral Radiology, 2+ years', is_active: true },
  
  // ALTERNATIVE MEDICINE - 12 positions
  { id: 64, title: 'Ayurvedic Doctor', company: 'Ayush Wellness Center', location: 'Bangalore', city: 'Bangalore', salary: '₹4,00,000 – ₹7,00,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'BAMS', description: 'Ayurvedic consultation and treatment', requirements: 'BAMS, 2+ years clinical practice', is_active: true },
  { id: 65, title: 'Homeopathic Doctor', company: 'Homeo Care Clinic', location: 'Hyderabad', city: 'Hyderabad', salary: '₹3,50,000 – ₹6,00,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'BHMS', description: 'Homeopathic medicine and patient care', requirements: 'BHMS, 1+ year experience', is_active: true },
  { id: 66, title: 'Unani Doctor', company: 'Unani Medical Center', location: 'Delhi', city: 'Delhi', salary: '₹3,50,000 – ₹6,00,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'BUMS', description: 'Unani medicine practice', requirements: 'BUMS, registered practitioner', is_active: true },
  { id: 67, title: 'Naturopathy Doctor', company: 'Nature Cure Hospital', location: 'Bangalore', city: 'Bangalore', salary: '₹4,00,000 – ₹7,00,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'BNYS', description: 'Naturopathy and yoga therapy', requirements: 'BNYS, 2+ years experience', is_active: true },
  { id: 68, title: 'Ayurvedic Consultant – Panchakarma', company: 'Ayush Wellness', location: 'Mumbai', city: 'Mumbai', salary: '₹5,00,000 – ₹8,50,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'MD – Ayurveda (Panchakarma)', description: 'Panchakarma therapy specialist', requirements: 'MD Ayurveda Panchakarma, 3+ years', is_active: true },
  { id: 69, title: 'Yoga Therapist', company: 'Wellness Center', location: 'Pune', city: 'Pune', salary: '₹2,80,000 – ₹4,50,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'BNYS', description: 'Yoga therapy and wellness programs', requirements: 'Yoga certification, 1+ year teaching', is_active: true },
  { id: 70, title: 'Acupuncturist', company: 'Holistic Health Clinic', location: 'Bangalore', city: 'Bangalore', salary: '₹3,50,000 – ₹6,00,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'Acupuncture Certification', description: 'Acupuncture treatment specialist', requirements: 'Acupuncture certification, 2+ years', is_active: true },
  { id: 71, title: 'Ayurvedic Physician – Kayachikitsa', company: 'Traditional Medicine Center', location: 'Hyderabad', city: 'Hyderabad', salary: '₹4,50,000 – ₹7,50,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'MD – Ayurveda (Kayachikitsa)', description: 'General ayurvedic medicine specialist', requirements: 'MD Ayurveda, 2+ years clinical practice', is_active: true },
  { id: 72, title: 'Homeopathic Consultant', company: 'Homeo Plus Clinic', location: 'Chennai', city: 'Chennai', salary: '₹4,00,000 – ₹7,00,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'MD – Homeopathy', description: 'Senior homeopathic practitioner', requirements: 'MD Homeopathy, 3+ years', is_active: true },
  { id: 73, title: 'Ayurvedic Dietitian', company: 'Ayush Wellness', location: 'Bangalore', city: 'Bangalore', salary: '₹3,00,000 – ₹5,00,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'BAMS', description: 'Ayurvedic nutrition and diet consultation', requirements: 'BAMS, nutrition certification', is_active: true },
  { id: 74, title: 'Siddha Doctor', company: 'Siddha Medical Center', location: 'Chennai', city: 'Chennai', salary: '₹3,50,000 – ₹6,00,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'BSMS', description: 'Siddha medicine practice', requirements: 'BSMS, registered practitioner', is_active: true },
  { id: 75, title: 'Alternative Medicine Consultant', company: 'Integrated Health Clinic', location: 'Delhi', city: 'Delhi', salary: '₹5,00,000 – ₹9,00,000', categoryKey: 'alternative', category: 'Alternative Medicine', specialization: 'BAMS/BHMS', description: 'Integrated alternative medicine approach', requirements: 'BAMS/BHMS/BNYS, 4+ years', is_active: true },
  
  // MEDICAL COLLEGES - 12 positions
  { id: 76, title: 'Assistant Professor – Anatomy', company: 'Medical College Hyderabad', location: 'Hyderabad', city: 'Hyderabad', salary: '₹8,00,000 – ₹12,00,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'MD – Anatomy', description: 'Teaching and research in human anatomy', requirements: 'MD Anatomy, 2+ years teaching experience', is_active: true },
  { id: 77, title: 'Professor – General Medicine', company: 'AIIMS Delhi', location: 'Delhi', city: 'Delhi', salary: '₹15,00,000 – ₹25,00,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'MD/DM – General Medicine', description: 'Senior faculty for internal medicine department', requirements: 'MD/DM Medicine, 10+ years teaching', is_active: true },
  { id: 78, title: 'Associate Professor – Pharmacology', company: 'Kasturba Medical College', location: 'Manipal', city: 'Manipal', salary: '₹10,00,000 – ₹16,00,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'MD – Pharmacology', description: 'Pharmacology teaching and drug research', requirements: 'MD Pharmacology, 5+ years teaching', is_active: true },
  { id: 79, title: 'Junior Resident – Surgery', company: 'PGIMER Chandigarh', location: 'Chandigarh', city: 'Chandigarh', salary: '₹75,000 – ₹90,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'MBBS', description: 'Surgical residency training program', requirements: 'MBBS, MCI registration, NEET-PG qualified', is_active: true },
  { id: 80, title: 'Senior Resident – Paediatrics', company: 'JIPMER Puducherry', location: 'Puducherry', city: 'Puducherry', salary: '₹90,000 – ₹1,10,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'MD – Paediatrics', description: 'Senior residency in pediatrics', requirements: 'MD Paediatrics, 1+ year experience', is_active: true },
  { id: 81, title: 'Tutor – Physiology', company: 'Gandhi Medical College', location: 'Hyderabad', city: 'Hyderabad', salary: '₹4,00,000 – ₹6,00,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'M.Sc Physiology', description: 'Physiology practical and tutorial classes', requirements: 'MSc Physiology, teaching interest', is_active: true },
  { id: 82, title: 'Assistant Professor – Biochemistry', company: 'Christian Medical College', location: 'Vellore', city: 'Vellore', salary: '₹8,00,000 – ₹12,00,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'PhD – Biochemistry', description: 'Medical biochemistry teaching and research', requirements: 'PhD Biochemistry, 2+ years teaching', is_active: true },
  { id: 83, title: 'Professor – Surgery', company: 'Maulana Azad Medical College', location: 'Delhi', city: 'Delhi', salary: '₹15,00,000 – ₹25,00,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'MS/MCh – Surgery', description: 'Head of surgical department and teaching', requirements: 'MS/MCh Surgery, 10+ years experience', is_active: true },
  { id: 84, title: 'Demonstrator – Pathology', company: 'St. Johns Medical College', location: 'Bangalore', city: 'Bangalore', salary: '₹3,50,000 – ₹5,50,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'MD – Pathology', description: 'Laboratory demonstration and teaching', requirements: 'MD Pathology, fresh graduates welcome', is_active: true },
  { id: 85, title: 'Associate Professor – Community Medicine', company: 'Osmania Medical College', location: 'Hyderabad', city: 'Hyderabad', salary: '₹10,00,000 – ₹16,00,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'MD – Community Medicine', description: 'Public health teaching and field work', requirements: 'MD Community Medicine, 5+ years', is_active: true },
  { id: 86, title: 'Assistant Professor – Microbiology', company: 'Armed Forces Medical College', location: 'Pune', city: 'Pune', salary: '₹8,00,000 – ₹12,00,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'MD – Microbiology', description: 'Medical microbiology teaching and lab work', requirements: 'MD Microbiology, 2+ years teaching', is_active: true },
  { id: 87, title: 'Junior Resident – Obstetrics', company: 'Lady Hardinge Medical College', location: 'Delhi', city: 'Delhi', salary: '₹75,000 – ₹90,000', categoryKey: 'colleges', category: 'Medical Education', specialization: 'MBBS', description: 'OBG residency training program', requirements: 'MBBS, NEET-PG qualified', is_active: true },
];

const Home = () => {
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
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

  // ✅ Backend Jobs State - Dynamic Category Counts (Initialize with dummy data)
  // eslint-disable-next-line no-unused-vars
  const [liveJobs, setLiveJobs] = useState(DUMMY_JOBS);

  // ✅ Fetch Jobs from Backend - DISABLED to show dummy data
  // Uncomment when backend has sufficient jobs (50+)
  /*
  useEffect(() => {
    const fetchLiveJobs = async () => {
      try {
        const jobsData = await jobService.getJobs();
        const jobs = Array.isArray(jobsData) ? jobsData : [];
        console.log('📊 Fetched jobs from backend:', jobs.length);
        // Use backend jobs only if there are many (to avoid overriding 87 dummy jobs)
        if (jobs.length >= 50) {
          setLiveJobs(jobs);
          console.log('✅ Using backend jobs');
        } else {
          console.log('⚠️ Backend has only', jobs.length, 'jobs - keeping dummy data (87 jobs)');
        }
      } catch (error) {
        console.error('❌ Error fetching jobs:', error);
        console.log('✅ Using dummy data due to error');
        // Dummy data already set in initial state
      }
    };
    fetchLiveJobs();
  }, []);
  */

  // Removed auto-scroll - user wants manual tab selection only

  // Auto-scroll hospital logos
  useEffect(() => {
    const total = Math.ceil(6 / 3); // hospitalLogos.length / LOGOS_PER_SLIDE
    const timer = setInterval(() => {
      setLogoIndex(prev => (prev + 1) % total);
    }, 2500);
    return () => clearInterval(timer);
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

  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: '',
  });

  const cities = [
    // Major Metros
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    
    // Tier 1 Cities
    'Jaipur',
    'Lucknow',
    'Kanpur',
    'Nagpur',
    'Indore',
    'Thane',
    'Bhopal',
    'Visakhapatnam',
    'Vadodara',
    'Patna',
    'Ludhiana',
    
    // Healthcare Hubs
    'Vellore',
    'Manipal',
    'Mysore',
    'Coimbatore',
    'Kochi',
    'Trivandrum',
    'Mangalore',
    'Puducherry',
    
    // Tier 2 Cities
    'Chandigarh',
    'Gurgaon',
    'Noida',
    'Ghaziabad',
    'Faridabad',
    'Rajkot',
    'Surat',
    'Nashik',
    'Aurangabad',
    'Amritsar',
    'Jalandhar',
    'Ranchi',
    'Guwahati',
    'Bhubaneswar',
    'Raipur',
    'Dehradun',
    'Jammu',
    'Vijayawada',
    'Guntur',
    'Warangal',
    'Tirupati',
    'Madurai',
  ];

  const popularJobTitles = [
    // Doctors (20)
    'Cardiologist',
    'General Physician',
    'Pediatrician',
    'Orthopedic Surgeon',
    'Gynecologist',
    'Neurologist',
    'Dermatologist',
    'Radiologist',
    'Anesthesiologist',
    'Emergency Medicine Doctor',
    'Psychiatrist',
    'Ophthalmologist',
    'ENT Specialist',
    'Urologist',
    'Gastroenterologist',
    'Pulmonologist',
    'Nephrologist',
    'Oncologist',
    'General Surgeon',
    'Medical Officer',
    
    // Nursing (15)
    'Staff Nurse',
    'ICU Nurse',
    'OT Nurse',
    'Emergency Nurse',
    'Nursing Supervisor',
    'Ward In-charge',
    'Clinical Nurse',
    'Pediatric Nurse',
    'Cardiac Nurse',
    'Dialysis Nurse',
    'Operation Theatre Nurse',
    'Community Health Nurse',
    'Nursing Officer',
    'Critical Care Nurse',
    'Nurse Practitioner',
    
    // Allied Health (15)
    'Physiotherapist',
    'Medical Lab Technician',
    'Radiographer',
    'CT Scan Technician',
    'MRI Technician',
    'X-Ray Technician',
    'Dietitian',
    'Nutritionist',
    'Pharmacist',
    'Clinical Pharmacist',
    'Optometrist',
    'Occupational Therapist',
    'Speech Therapist',
    'Respiratory Therapist',
    'Dialysis Technician',
    
    // Hospital Management (20)
    'Hospital Administrator',
    'Medical Superintendent',
    'Hospital Manager',
    'Front Office Executive',
    'Receptionist',
    'Patient Relations Executive',
    'HR Manager',
    'Accounts Manager',
    'Operations Manager',
    'Quality Manager',
    'Facility Manager',
    'Finance Manager',
    'Administrative Officer',
    'Billing Executive',
    'Medical Records Officer',
    'IT Manager',
    'Biomedical Engineer',
    'Housekeeping Supervisor',
    'Security Supervisor',
    'Customer Service Executive',
    
    // Dental (8)
    'Dentist',
    'Dental Surgeon',
    'Orthodontist',
    'Endodontist',
    'Oral Surgeon',
    'Pediatric Dentist',
    'Periodontist',
    'Prosthodontist',
    
    // Alternative Medicine (8)
    'Ayurvedic Doctor',
    'Homeopathic Doctor',
    'Unani Doctor',
    'Naturopath',
    'Yoga Therapist',
    'Acupuncturist',
    'Ayurvedic Consultant',
    'Homeopathic Consultant',
    
    // Medical Colleges (8)
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Junior Resident',
    'Senior Resident',
    'Medical Faculty',
    'Tutor',
    'Demonstrator',
    
    // Paramedical & Other (10)
    'Paramedic',
    'Emergency Medical Technician',
    'Ambulance Driver',
    'Medical Social Worker',
    'Counselor',
    'Clinical Psychologist',
    'Medical Transcriptionist',
    'Health Inspector',
    'Public Health Officer',
    'Clinical Research Coordinator',
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
    if (searchCategory) params.append('category', searchCategory);
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
    { id: 1, title: 'Hospital Jobs – Doctors', Icon: Stethoscope, bg: 'bg-gradient-to-br from-emerald-400 to-teal-600',    positions: getJobCountByCategory('doctors'),     key: 'doctors' },
    { id: 2, title: 'Hospital Management',    Icon: Building2,   bg: 'bg-gradient-to-br from-emerald-400 to-teal-600',    positions: getJobCountByCategory('management'), key: 'management' },
    { id: 3, title: 'Medical Colleges',        Icon: GraduationCap, bg: 'bg-gradient-to-br from-emerald-400 to-teal-600', positions: getJobCountByCategory('colleges'),    key: 'colleges' },
    { id: 4, title: 'Allied Health',           Icon: Activity,    bg: 'bg-gradient-to-br from-emerald-400 to-teal-600',   positions: getJobCountByCategory('allied'),      key: 'allied' },
    { id: 5, title: 'Nursing',                 Icon: Heart,       bg: 'bg-gradient-to-br from-emerald-400 to-teal-600',    positions: getJobCountByCategory('nursing'),     key: 'nursing' },
    { id: 6, title: 'Alternative Medicine',    Icon: Leaf,        bg: 'bg-gradient-to-br from-emerald-400 to-teal-600', positions: getJobCountByCategory('alternative'), key: 'alternative' },
    { id: 7, title: 'Dental',                  Icon: Smile,       bg: 'bg-gradient-to-br from-emerald-400 to-teal-600',  positions: getJobCountByCategory('dental'),      key: 'dental' },
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
        'General Physician / Medical Officer',
        'Casualty Medical Officer',
        'Emergency Medical Officer',
        'Resident Medical Officer (RMO)',
        'Junior Medical Officer',
        'Senior Medical Officer',
        'Consultant General Practitioner',
        'Primary Care Physician',
        'Family Medicine Practitioner',
        'Occupational Health Physician',
        'Medical Officer – Government',
        'Medical Officer – Armed Forces',
        'Medical Officer – Railways',
        'Medical Officer – ESI',
        'Medical Superintendent (MBBS)',
        'Medical Advisor',
        'Clinical Research Associate',
        'Medical Writer',
        'Medical Coding Specialist',
        'Insurance Medical Officer',
        'Aviation Medical Examiner',
        'Sports Medicine Physician',
        'Community Health Officer',
        'Public Health Officer',
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
      'MHA / MBA Healthcare': [
        'Hospital Director / Chief Executive Officer',
        'Chief Operating Officer',
        'Hospital Administrator / Manager',
        'Assistant Hospital Administrator',
        'General Manager',
        'Operations Manager',
        'Quality Manager',
        'Facility Manager',
      ],

      'MBBS + MHA': [
        'Medical Superintendent',
        'Medical Director',
        'Chief Medical Officer',
        'Medical Administrator',
      ],

      'MBA / PGDM': [
        'Business Development Manager',
        'Marketing Manager',
        'Strategy Manager',
        'Project Manager',
        'General Manager – Operations',
      ],

      'BBA / B.Com / BHM': [
        'Administrative Officers',
        'Front Office Manager',
        'Assistant Manager',
        'Management Trainee',
        'Executive Assistant',
      ],

      'Any Graduate': [
        'Front Office Executive',
        'Receptionist / Front Desk Staff',
        'Patient Relation Executive',
        'Customer Service Representative',
        'Data Entry Operator',
      ],

      'MBA HR / MSW': [
        'HR Manager',
        'HR Business Partner',
        'Recruitment Officer',
        'Training & Development Officer',
        'Payroll Officer',
        'Employee Relations Manager',
      ],

      'M.Com / CA / ICWA': [
        'Chief Financial Officer',
        'Finance Manager',
        'Accounts Manager',
        'Senior Accountant',
        'Billing Supervisor',
        'Internal Auditor',
        'Insurance Coordinator',
      ],

      'B.Com / BBA Finance': [
        'Assistant Manager F&A',
        'Junior Finance Executive',
        'Accountant',
        'Cashier / Billing Clerks',
        'Accounts Executive',
      ],

      'B.Tech / B.E.': [
        'IT Manager / System Administrator',
        'Network Engineer',
        'Biomedical Engineer',
        'Software Support Technician',
        'Technical Support Engineer',
        'Maintenance Engineer',
      ],

      'Diploma / ITI': [
        'Support Engineer',
        'Diagnostic Technician / Engineer',
        'Maintenance Supervisor',
        'Automobile Technician',
        'Electrician',
        'Plumber',
      ],

      'Any Degree': [
        'Medical Records Officer',
        'Quality Executive',
        'Quality & Compliance Officer',
        'Transport & Ambulance Coordinator',
        'Housekeeping Manager',
        'Security Supervisor',
        'Canteen Supervisor',
        'Laundry Supervisor',
        'Public Relations Officer',
      ],

      'LLB / Company Secretary': [
        'Legal Advisor',
        'Compliance Officer',
        'Legal Counsel',
      ],

      'Marketing / PR Degree': [
        'Marketing Manager',
        'Brand Manager',
        'Digital Marketing Manager',
        'Public Relations Officer',
      ],
    },


    // 🎓 MEDICAL COLLEGES
    colleges: {
      'MBBS': [
        'Tutor / Demonstrator',
        'Junior Resident',
        'Teaching Assistant',
        'Clinical Instructor',
      ],

      'MD': [
        'Assistant Professor',
        'Associate Professor',
        'Professor',
        'Senior Resident',
        'Academic Consultant',
        'Medical Faculty',
      ],

      'MS': [
        'Assistant Professor – Surgery',
        'Associate Professor – Surgery',
        'Professor – Surgery',
        'Senior Resident – Surgery',
        'Surgical Faculty',
      ],

      'DM': [
        'Associate Professor – Super Specialty',
        'Professor – Super Specialty',
        'Senior Faculty – Super Specialty',
      ],

      'MCh': [
        'Assistant Professor – Surgical Super Specialty',
        'Associate Professor – Surgical Super Specialty',
        'Professor – Surgical Super Specialty',
      ],

      'PhD': [
        'Professor & Head',
        'Dean',
        'Research Director',
        'Principal',
        'Vice Chancellor',
        'Research Faculty',
      ],

      'MHA / MBA Healthcare': [
        'Academic Coordinator',
        'Administrative Officer',
        'Assistant Registrar',
        'Deputy Registrar',
        'College Administrator',
      ],

      'Others': [
        'Senior Assistant',
        'Administrative Staff',
        'Support Staff',
      ],
    },

    // 🩺 ALLIED HEALTH
    allied: {
      'BPT': [
        'Physiotherapist – General',
        'Physiotherapist – Orthopaedics',
        'Physiotherapist – Neurology',
        'Physiotherapist – Cardiopulmonary',
        'Physiotherapist – Paediatrics',
        'Physiotherapist – Sports Medicine',
        'Physiotherapist – ICU',
        'Rehabilitation Specialist',
        'Occupational Therapist',
      ],

      'MPT': [
        'Senior Physiotherapist',
        'Consultant Physiotherapist',
        'Physiotherapy Supervisor',
        'Head of Physiotherapy Department',
        'Clinical Specialist – Physiotherapy',
        'Rehabilitation Manager',
      ],

      'B.Sc Medical Lab Technology': [
        'Medical Lab Technician',
        'Lab Technologist',
        'Pathology Lab Technician',
        'Microbiology Lab Technician',
        'Biochemistry Lab Technician',
        'Haematology Technician',
        'Clinical Lab Technologist',
        'Lab Supervisor',
        'Quality Control Technician',
      ],

      'B.Sc Radiology & Imaging Technology': [
        'Radiographer',
        'CT Scan Technician',
        'MRI Technician',
        'X-Ray Technician',
        'Ultrasound Technician',
        'Mammography Technician',
        'Interventional Radiology Technician',
        'Nuclear Medicine Technologist',
        'Radiology Supervisor',
      ],

      'B.Sc Anaesthesia & OT Technology': [
        'Anaesthesia Technician',
        'Operation Theatre Technician',
        'OT Assistant',
        'CSSD Technician',
        'Surgical Technologist',
        'Anaesthesia Technologist',
      ],

      'B.Sc Dialysis Technology': [
        'Dialysis Technician',
        'Haemodialysis Technician',
        'Peritoneal Dialysis Technician',
        'Dialysis Supervisor',
        'Renal Care Technician',
      ],

      'B.Sc Cardio Vascular Technology': [
        'Cardiac Technician',
        'ECG Technician',
        'Echo Technician',
        'Cath Lab Technician',
        'Cardiology Technologist',
        'Cardiovascular Technologist',
      ],

      'B.Sc Respiratory Therapy': [
        'Respiratory Therapist',
        'Pulmonary Function Technician',
        'Ventilator Specialist',
        'Sleep Lab Technician',
        'Critical Care Respiratory Therapist',
      ],

      'B.Sc Optometry': [
        'Optometrist',
        'Clinical Optometrist',
        'Refractive Optometrist',
        'Contact Lens Specialist',
        'Low Vision Specialist',
        'Paediatric Optometrist',
      ],

      'B.Sc Emergency & Critical Care Technology': [
        'Emergency Medical Technician',
        'Critical Care Technician',
        'Trauma Care Specialist',
        'Emergency Room Technician',
        'ICU Technician',
      ],

      'B.Sc Clinical Nutrition & Dietetics': [
        'Clinical Dietitian',
        'Nutritionist',
        'Therapeutic Dietitian',
        'Paediatric Nutritionist',
        'Sports Nutritionist',
        'Community Nutritionist',
        'Food Service Manager',
      ],

      'B.Sc Medical Biotechnology': [
        'Medical Biotechnologist',
        'Clinical Research Associate',
        'Lab Research Assistant',
        'Quality Control Analyst',
        'Bioinformatics Specialist',
      ],

      'Clinical Biochemistry': [
        'Clinical Biochemist',
        'Lab Biochemist',
        'Research Biochemist',
      ],

      'Clinical Microbiology': [
        'Clinical Microbiologist',
        'Infection Control Officer',
        'Microbiology Lab Supervisor',
      ],

      'Clinical Research': [
        'Clinical Research Coordinator',
        'Clinical Data Manager',
        'Clinical Trial Associate',
        'Study Coordinator',
      ],
    },

    // 🌿 ALTERNATIVE MEDICINE
    alternative: {
      'BAMS': [
        'Ayurvedic Practitioner',
        'Ayurvedic Consultant',
        'Ayurvedic Medical Officer',
        'Panchakarma Specialist',
        'Ayurvedic Physician – General Practice',
        'Clinical Ayurvedic Doctor',
        'Wellness Consultant – Ayurveda',
      ],

      'BHMS': [
        'Homeopathic Practitioner',
        'Homeopathic Consultant',
        'Homeopathic Medical Officer',
        'Clinical Homeopath',
        'General Homeopathic Physician',
      ],

      'BUMS': [
        'Unani Practitioner',
        'Unani Medical Officer',
        'Unani Consultant',
        'Clinical Unani Physician',
        'General Unani Doctor',
      ],

      'BNYS': [
        'Naturopath',
        'Yoga Therapist',
        'Naturopathy & Yoga Consultant',
        'Wellness & Lifestyle Consultant',
        'Alternative Medicine Practitioner',
      ],

      'MD Ayurveda': [
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

      'MD Homeopathy': [
        'MD (Homeopathy) – Homeopathic Materia Medica',
        'MD (Homeopathy) – Homeopathic Pharmacy',
        'MD (Homeopathy) – Organon of Medicine & Philosophy',
        'MD (Homeopathy) – Practice of Medicine',
        'MD (Homeopathy) – Paediatrics',
        'MD (Homeopathy) – Repertory',
        'MD (Homeopathy) – General',
      ],

      'MD Naturopathy': [
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
      ],

      'MSc Naturopathy': [
        'MSc – Yoga & Naturopathy',
        'MSc – Naturopathy',
        'Senior Naturopathy Consultant',
        'Yoga Therapy Specialist',
        'Wellness Program Director',
      ],

      'MD Unani': [
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
      'ANM': [
        'Staff Nurse – ANM',
        'Community Health Nurse',
        'Village Health Nurse',
        'School Health Nurse',
        'Home Healthcare Nurse',
        'Midwife',
        'Maternal & Child Health Nurse',
        'Primary Health Centre Nurse',
        'Auxiliary Nurse',
      ],

      'GNM': [
        'Staff Nurse – General Ward',
        'Staff Nurse – ICU',
        'Staff Nurse – Emergency',
        'Staff Nurse – OT',
        'Staff Nurse – Paediatric Ward',
        'Staff Nurse – Maternity Ward',
        'Staff Nurse – Geriatric Ward',
        'Infection Control Nurse',
        'Ward In-charge',
        'Nursing Supervisor',
        'Clinical Nurse',
        'Occupational Health Nurse',
      ],

      'B.Sc Nursing': [
        'Registered Nurse – ICU',
        'Registered Nurse – NICU',
        'Registered Nurse – CCU',
        'Registered Nurse – Emergency/Casualty',
        'Registered Nurse – Operation Theatre',
        'Registered Nurse – Dialysis',
        'Registered Nurse – Oncology',
        'Registered Nurse – Cardiology',
        'Registered Nurse – Neurology',
        'Registered Nurse – Orthopaedics',
        'Registered Nurse – Paediatrics',
        'Registered Nurse – Psychiatry',
        'Registered Nurse – Labour Room',
        'Clinical Coordinator',
        'Nursing Instructor',
        'Nursing Tutor',
        'Quality Assurance Nurse',
        'Patient Safety Officer',
      ],

      'Post Basic B.Sc Nursing': [
        'Senior Staff Nurse',
        'Critical Care Specialist Nurse',
        'Nursing Officer',
        'Deputy Nursing Superintendent',
        'Ward Manager',
        'Nursing Supervisor – Specialized Units',
        'Clinical Nurse Specialist',
        'Nursing Educator',
      ],

      'M.Sc Nursing': [
        'Nursing Superintendent',
        'Assistant Director of Nursing',
        'Deputy Director of Nursing',
        'Director of Nursing',
        'Principal – Nursing College',
        'Vice Principal – Nursing College',
        'Professor of Nursing',
        'Associate Professor of Nursing',
        'Assistant Professor of Nursing',
        'Nursing Research Coordinator',
        'Clinical Nurse Specialist – Advanced Practice',
        'Nurse Practitioner',
        'Quality Manager – Nursing',
      ],

      'M.Phil Nursing': [
        'Nursing Research Scientist',
        'Clinical Research Nurse',
        'Nurse Educator – Advanced',
        'Director of Nursing Education',
      ],

      'PhD Nursing': [
        'Professor & Head – Nursing',
        'Dean – College of Nursing',
        'Research Director – Nursing',
        'Principal Scientist – Nursing Research',
        'Chief Nursing Officer',
      ],
    },

    // 🦷 DENTAL
    dental: {
      BDS: [
        'General Dental Practitioner',
        'Dental Surgeon',
        'Dental Officer',
        'Clinical Dentist',
        'Oral Health Consultant',
        'Dental Consultant – General Practice',
        'Community Dental Officer',
        'Public Health Dentist',
        'Oral Hygiene Specialist',
        'Dental Clinical Associate',
        'Emergency Dental Services',
        'Mobile Dental Clinic Dentist',
        'Dental Insurance Consultant',
      ],

      MDS: [
        'MDS – Conservative Dentistry & Endodontics',
        'MDS – Oral & Maxillofacial Surgery',
        'MDS – Oral Medicine & Radiology',
        'MDS – Oral Pathology',
        'MDS – Orthodontics',
        'MDS – Pedodontics',
        'MDS – Periodontology',
        'MDS – Prosthodontics',
        'MDS – Public Health Dentistry',
        'MDS – Oral & Maxillofacial Pathology',
      ],
    },
  };

  // Jobs from backend API - no dummy data
  const jobs = liveJobs;

  const steps = [
    { id: 1, Icon: UserPlus,   iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600',  title: 'Register an account', description: 'Create your professional profile in minutes.' },
    { id: 2, Icon: Search,     iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600',  title: 'Search jobs',          description: 'Explore thousands of verified healthcare jobs.' },
    { id: 3, Icon: FileCheck,  iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600', title: 'Apply easily',         description: 'Apply instantly and connect with recruiters.' },
  ];

  const TOP_CATEGORIES_LIMIT = 5;

  const topCategoryKeys = Object.entries(
    jobs.reduce((acc, job) => {
      acc[job.categoryKey] = (acc[job.categoryKey] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_CATEGORIES_LIMIT)
    .map(([key]) => key);

  console.log('🔍 Top category keys:', topCategoryKeys);
  console.log('📊 Total jobs available:', jobs.length);
  console.log('🎯 Active tab:', activeTab);
  console.log('🎯 All job categoryKeys:', jobs.map(j => j.categoryKey));

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

  // ✅ Get specializations based on selected degree
  const specializations = (() => {
    if (!selectedDegree) return [];
    
    if (activeTab === 'latest') {
      // For "Latest Jobs", search through all categories to find the degree
      for (const categoryKey in categorySpecializations) {
        if (categorySpecializations[categoryKey][selectedDegree]) {
          return categorySpecializations[categoryKey][selectedDegree];
        }
      }
      return [];
    } else {
      // For specific category tabs, get specializations directly
      return categorySpecializations[activeTab]?.[selectedDegree] || [];
    }
  })();

  console.log('🎓 Selected degree:', selectedDegree);
  console.log('📋 Available specializations:', specializations.length);
  if (specializations.length > 0) {
    console.log('📋 Sample specializations:', specializations.slice(0, 3));
  }

  const getSalaryValue = (salaryString) => {
    const numbers = salaryString?.match(/\d+/g);
    if (!numbers) return 0;
    return parseInt(numbers[0], 10);
  };

  // Using predefined cities array instead of extracting from jobs
  // const jobCities = [...new Set(jobs.map((job) => job.location))];

  const baseJobs =
    activeTab === 'latest'
      ? topCategoryKeys.length > 0 
        ? jobs.filter((job) => topCategoryKeys.includes(job.categoryKey))
        : jobs // Show all jobs if no top categories calculated yet
      : jobs.filter((job) => job.categoryKey === activeTab);

  console.log('📋 Base jobs after category filter:', baseJobs.length);
  if (baseJobs.length > 0) {
    console.log('📋 Sample base job:', baseJobs[0]);
  }

  const filteredJobs = baseJobs.filter((job) => {
    const specializationMatch = filterSpecialization
      ? job.specialization === filterSpecialization
      : true;
    const cityMatch = filterCity ? job.city === filterCity : true;

    let salaryMatch = true;
    if (filterSalary) {
      const [min, max] = filterSalary.split('-').map(Number);
      const jobSalary = getSalaryValue(job.salary);
      salaryMatch = jobSalary >= min && jobSalary <= max;
    }

    return specializationMatch && cityMatch && salaryMatch;
  });

  console.log('🎯 Filters applied:', { 
    specialization: filterSpecialization, 
    city: filterCity, 
    salary: filterSalary,
    degree: selectedDegree 
  });
  console.log('✅ Filtered jobs count:', filteredJobs.length);

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
        <div className="absolute inset-0 bg-gradient-to-r from-teal-900/80 via-teal-800/75 to-emerald-700/70" />

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
        list="job-titles-list"
        placeholder="Job title, keywords..."
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full outline-none text-gray-700 text-sm md:text-base"
      />
      <datalist id="job-titles-list">
        {popularJobTitles.map((title, idx) => (
          <option key={idx} value={title} />
        ))}
      </datalist>
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
      <select 
        value={searchCategory}
        onChange={(e) => setSearchCategory(e.target.value)}
        className="w-full outline-none bg-transparent text-gray-700 text-sm md:text-base cursor-pointer"
      >
        <option value="">All Categories</option>
        <option value="doctors">Hospital Jobs – Doctors</option>
        <option value="nursing">Nursing</option>
        <option value="management">Hospital Management</option>
        <option value="allied">Allied Health</option>
        <option value="dental">Dental</option>
        <option value="alternative">Alternative Medicine</option>
        <option value="colleges">Medical Colleges</option>
      </select>
    </div>

    {/* Button */}
    <div className="px-3 py-2 md:px-3 md:py-1.5">
      <button
        type="submit"
        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 md:py-1.5 font-semibold rounded-full transition text-sm md:text-base"
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
              className="bg-white text-emerald-700 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Quick Apply
            </button>

            <button
              onClick={() => setShowQuickPostModal(true)}
              className="border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-emerald-700 transition"
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
                className="bg-white rounded-2xl p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 cursor-pointer border border-gray-100 group hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${category.bg} group-hover:scale-110 transition-transform duration-300`}>
                    <category.Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {category.positions > 0
                        ? `${category.positions} open position${category.positions !== 1 ? 's' : ''}`
                        : 'Positions available'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
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
              Discover the most in-demand medical job openings across India. ({jobs.length} positions available)
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
                      setSelectedDegree('');
                      setFilterSpecialization('');
                      setFilterCity('');
                      setFilterSalary('');
                      setActiveDot(0);
                    }}
                    className={`flex-shrink-0 px-4 py-2 rounded-full border whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-teal-700 to-emerald-500 text-white shadow'
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
                      setSelectedDegree('');
                      setFilterSpecialization('');
                      setFilterCity('');
                      setFilterSalary('');
                      setActiveDot(0);
                    }}
                    className={`px-5 py-2 rounded-full border whitespace-nowrap transition ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-teal-700 to-emerald-500 text-white shadow'
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
          <div className="mb-8 px-2">
            {/* 2-col grid on mobile, single row on desktop */}
            <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:justify-center md:gap-3">
              <select
                value={selectedDegree}
                onChange={(e) => { setSelectedDegree(e.target.value); setFilterSpecialization(''); }}
                className="w-full md:w-auto border border-gray-200 rounded-full px-3 py-2 text-sm bg-white text-gray-700 hover:border-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
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
                className="w-full md:w-auto border border-gray-200 rounded-full px-3 py-2 text-sm bg-white text-gray-700 hover:border-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>

              <select
                value={filterCity}
                onChange={(e) => { setFilterCity(e.target.value); setActiveDot(0); }}
                className="w-full md:w-auto border border-gray-200 rounded-full px-3 py-2 text-sm bg-white text-gray-700 hover:border-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={filterSalary}
                onChange={(e) => { setFilterSalary(e.target.value); setActiveDot(0); }}
                className="w-full md:w-auto border border-gray-200 rounded-full px-3 py-2 text-sm bg-white text-gray-700 hover:border-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {salaryRanges.map((range) => (
                  <option key={range.value || 'all'} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters — full width on mobile, inline on desktop */}
            <div className="flex justify-center mt-2 md:mt-3">
              <button
                onClick={() => { setSelectedDegree(''); setFilterSpecialization(''); setFilterCity(''); setFilterSalary(''); }}
                className="w-full md:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition text-sm font-medium border border-emerald-600"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Jobs Section */}
{filteredJobs.length === 0 ? (
  <div className="text-center py-10">
    <p className="text-gray-500 text-lg">No jobs found for selected filters.</p>
    <p className="text-gray-400 text-sm mt-2">
      Total jobs: {jobs.length} | Base jobs for this category: {baseJobs.length} | Filtered: {filteredJobs.length}
    </p>
    <button 
      onClick={() => { 
        setSelectedDegree(''); 
        setFilterSpecialization(''); 
        setFilterCity(''); 
        setFilterSalary(''); 
      }}
      className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
    >
      Clear All Filters
    </button>
  </div>
) : (
  <div className="relative">

    {/* ===== MOBILE VIEW (Swipe Cards) ===== */}
    <div className="flex md:hidden overflow-x-auto gap-4 px-1 no-scrollbar scroll-smooth">

      {filteredJobs.map((job) => (
        <div
          key={job.id}
          className="min-w-[85%] bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex-shrink-0"
        >
          <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
            {job.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">{job.category}</p>
          <p className="text-sm text-gray-700 mb-3 flex items-center">
            <span className="mr-1">📍</span> {job.city}
          </p>
          <p className="font-semibold text-gray-900 mb-4">{job.salary}</p>

          <button
            onClick={() => handleApply(job)}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
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
                  className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
                >
                  <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{job.category}</p>
                  <p className="text-sm text-gray-700 mb-3 flex items-center">
                    <span className="mr-1">📍</span> {job.city}
                  </p>
                  <p className="font-semibold text-gray-900 mb-4">{job.salary}</p>

                  <button
                    onClick={() => handleApply(job)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
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
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeDot === dot ? 'bg-emerald-600' : 'bg-gray-300'
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
          <div className="mb-5 flex justify-center">
            <div className={`w-18 h-18 w-[72px] h-[72px] ${step.iconBg} rounded-full flex items-center justify-center shadow-lg`}>
              <step.Icon className="w-9 h-9 text-white" />
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

    <div className="overflow-hidden">

      {/* ===== MOBILE VIEW (Swipe) ===== */}
      <div className="flex md:hidden overflow-x-auto gap-4 no-scrollbar scroll-smooth px-2">
        {hospitalLogos.map((logo, i) => (
          <div key={i} className="flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-center w-36 h-24 hover:shadow-md transition">
            <img src={logo} alt="Hospital Logo" className="h-12 max-w-full object-contain grayscale hover:grayscale-0 transition" />
          </div>
        ))}
      </div>

      {/* ===== DESKTOP VIEW (Auto-scroll slider) ===== */}
      <div className="hidden md:block overflow-hidden w-full">
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${logoIndex * 100}%)` }}
        >
          {Array.from({ length: Math.ceil(hospitalLogos.length / LOGOS_PER_SLIDE) }).map((_, slideIdx) => (
            <div key={slideIdx} className="min-w-full flex justify-center items-center gap-8">
              {hospitalLogos
                .slice(slideIdx * LOGOS_PER_SLIDE, slideIdx * LOGOS_PER_SLIDE + LOGOS_PER_SLIDE)
                .map((logo, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 flex items-center justify-center w-52 h-32 hover:shadow-lg hover:border-emerald-300 transition-all duration-300 group">
                    <img src={logo} alt="Hospital Logo" className="h-16 max-w-full object-contain grayscale group-hover:grayscale-0 transition duration-300" />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
</section>

      {/* CTA Section */}
<section className="py-12 md:py-16 bg-gradient-to-r from-teal-700 to-emerald-500">
  <div className="max-w-4xl mx-auto text-center px-4">

    {/* Heading */}
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
      Ready to Start Your Healthcare Career?
    </h2>

    {/* Description */}
    <p className="text-sm sm:text-base md:text-lg text-emerald-100 mb-6 md:mb-8">
      Join thousands of healthcare professionals finding their perfect job match
    </p>

    {/* Buttons */}
    <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">

      <Link
        to="/register"
        className="bg-white text-emerald-700 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base inline-flex items-center justify-center transition shadow-lg hover:bg-gray-50"
      >
        Create Free Account
      </Link>

      <Link
        to="/jobs"
        className="bg-white text-emerald-700 px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-medium text-sm md:text-base transition shadow-lg hover:bg-gray-50 inline-flex items-center justify-center"
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
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-teal-700 to-emerald-500 rounded-lg flex items-center justify-center">
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
              <li><Link to="/jobs" className="hover:text-emerald-500 transition">Browse Jobs</Link></li>
              <li><Link to="/register" className="hover:text-emerald-500 transition">Create Account</Link></li>
              <li><Link to="/login" className="hover:text-emerald-500 transition">Sign In</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-white font-semibold mb-2 md:mb-4 text-sm md:text-base">
              For Employers
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link to="/register" className="hover:text-emerald-500 transition">Post a Job</Link></li>
              <li><Link to="/login" className="hover:text-emerald-500 transition">Employer Login</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-2 md:mb-4 text-sm md:text-base">
              Company
            </h3>
            <ul className="space-y-1 md:space-y-2 text-xs md:text-sm">
              <li><Link to="/about" className="hover:text-emerald-500 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-500 transition">Contact</Link></li>
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expected Salary</label>
              <input
                type="text"
                value={applicationData.expectedSalary}
                onChange={(e) => setApplicationData({ ...applicationData, expectedSalary: e.target.value })}
                placeholder="Rs. 50,000"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available to Join</label>
              <input
                type="date"
                value={applicationData.availability}
                onChange={(e) => setApplicationData({ ...applicationData, availability: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button onClick={() => setShowApplyModal(false)} className="px-6 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg"
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
              className="mt-6 px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600"
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                  className="w-32 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
              {quickApplyErrors.coverLetter && <p className="text-red-500 text-sm mt-1">{quickApplyErrors.coverLetter}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume *</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setQuickApplyData({ ...quickApplyData, resume: e.target.files?.[0] || null })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-600"
              />
              {quickApplyErrors.resume && <p className="text-red-500 text-sm mt-1">{quickApplyErrors.resume}</p>}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => navigate('/register')} className="text-emerald-700 font-medium">
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
                className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg"
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                  className="w-32 px-3 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
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
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-600"
                placeholder="Enter job responsibilities, required skills, experience, etc."
              />

              {quickPostErrors.jobDescription && <p className="text-red-500 text-sm mt-1">{quickPostErrors.jobDescription}</p>}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => navigate('/register')} className="text-emerald-700 font-medium">
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
                className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg"
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