import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Star,
  Filter,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Modal from '../../components/common/Modal';
import { jobService } from '../../api/jobService';
import { useAuth } from '../../context/useAuth';

// ✅ STATIC DUMMY JOBS - 87 positions across all categories
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

const AllJobs = () => {
  // ✅ URL params support (Browse Jobs -> show particular job)
  const routerLocation = useRouterLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleApplyNow = (job) => {
    if (!isAuthenticated) {
      navigate('/register', { state: { from: '/jobs', message: 'Please register or log in to apply for jobs.' } });
      return;
    }
    setSelectedJob(job);
    setShowDetailsModal(false);
    setShowApplyModal(true);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [jobType, setJobType] = useState('all');

  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ More Filters modal state
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // ✅ More Filters values
  const [moreFilters, setMoreFilters] = useState({
    postedWithin: 'any', // any | 1 | 3 | 7 | 14
    minSalary: '', // number text
    maxSalary: '', // number text
    onlySaved: false,
  });

  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: '',
  });

  const [errors, setErrors] = useState({});

  // ✅ jobs in state (so we can toggle saved)
  const [jobs, setJobs] = useState(DUMMY_JOBS); // Initialize with dummy data
  const [loading, setLoading] = useState(true);

  // ✅ Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const jobsData = await jobService.getJobs();
        // Ensure jobsData is an array
        const jobsArray = Array.isArray(jobsData) ? jobsData : [];
        // Use backend jobs if available, otherwise keep dummy data
        if (jobsArray.length > 0) {
          setJobs(jobsArray);
          console.log('✅ Using backend jobs:', jobsArray.length);
        } else {
          console.log('⚠️ No backend jobs, using dummy data:', DUMMY_JOBS.length);
        }
      } catch (error) {
        console.error('❌ Failed to fetch jobs:', error);
        console.log('✅ Using dummy data due to error:', DUMMY_JOBS.length);
        // Keep dummy data on error
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);


  const cities = [
    'All Locations',
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

  // ✅ Load More state
  const JOBS_PER_PAGE = 6;
  const [visibleCount, setVisibleCount] = useState(JOBS_PER_PAGE);

  // ---------- helpers ----------
  const normalize = useCallback((v = '') => String(v).toLowerCase().trim(), []);

  const parseSalaryRange = useCallback((salaryStr = '') => {
    const cleaned = salaryStr.replace(/₹|Rs\.?/gi, '').replace(/\s/g, '');
    const parts = cleaned.split('-').map((p) => p.replace(/,/g, ''));
    const min = Number(parts?.[0] || 0);
    const max = Number(parts?.[1] || parts?.[0] || 0);
    return { min: isNaN(min) ? 0 : min, max: isNaN(max) ? 0 : max };
  }, []);

  const parsePostedDays = useCallback((postedStr = '') => {
    const s = String(postedStr).toLowerCase().trim();
    const num = Number(s.match(/\d+/)?.[0] ?? '0');
    if (s.includes('week')) return num * 7;
    if (s.includes('day')) return num;
    return 9999;
  }, []);

  // ✅ IMPORTANT FIX:
  // When user clicks "Browse Jobs" from Home, your Home page usually navigates like:
  // /jobs?search=Cardiologist   or   /jobs?search=Neurologist&location=Hyderabad
  // This useEffect reads URL params and applies them so ONLY that job shows.
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);

    const qSearch = params.get('search') || params.get('q') || '';
    const qLocation = params.get('location') || params.get('city') || '';
    const qType = params.get('type') || params.get('jobType') || '';
    const qSaved = params.get('saved'); // "1" or "true"
    const qPostedWithin = params.get('postedWithin'); // 1/3/7/14
    const qMinSalary = params.get('minSalary');
    const qMaxSalary = params.get('maxSalary');
    const qJobId = params.get('jobId'); // optional: open details directly

    // ✅ Apply only if param exists (so manual typing in filters won't be overwritten)
    if (qSearch) setSearchTerm(qSearch);
    if (qLocation) setSelectedLocation(qLocation);
    if (qType) setJobType(qType);

    if (qSaved != null || qPostedWithin || qMinSalary || qMaxSalary) {
      setMoreFilters((p) => ({
        ...p,
        onlySaved:
          qSaved == null ? p.onlySaved : qSaved === '1' || qSaved === 'true' || qSaved === 'yes',
        postedWithin: qPostedWithin || p.postedWithin,
        minSalary: qMinSalary ?? p.minSalary,
        maxSalary: qMaxSalary ?? p.maxSalary,
      }));
    }

    // ✅ If you pass jobId from Browse Jobs, open that job directly
    if (qJobId) {
      const id = Number(qJobId);
      const job = jobs.find((j) => j.id === id);
      if (job) {
        setSelectedJob(job);
        setShowDetailsModal(true);
      }
    }

    // ✅ reset pagination whenever route changes (like browse jobs click)
    setVisibleCount(JOBS_PER_PAGE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLocation.search]);

  // ✅ STAR FIX: toggle saved for a job
  const toggleSaveJob = (jobId) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, saved: !j.saved } : j)));
  };

  // ✅ filtering
  const filteredJobs = useMemo(() => {
    // Ensure jobs is an array before filtering
    if (!Array.isArray(jobs)) return [];

    const term = normalize(searchTerm);

    const cityVal = normalize(selectedLocation);
    const cityActive = cityVal && cityVal !== normalize('All Locations') && cityVal !== '';

    const typeActive = normalize(jobType) !== 'all';

    const minSalaryFilter = moreFilters.minSalary ? Number(moreFilters.minSalary) : null;
    const maxSalaryFilter = moreFilters.maxSalary ? Number(moreFilters.maxSalary) : null;
    const postedWithinDays =
      moreFilters.postedWithin === 'any' ? null : Number(moreFilters.postedWithin);

    return jobs.filter((job) => {
      if (term) {
        const blob = `${job.title} ${job.company_name || job.company} ${job.location || job.city}`.toLowerCase();
        if (!blob.includes(term)) return false;
      }

      if (cityActive) {
        if (!normalize(job.location || job.city || '').includes(cityVal)) return false;
      }

      if (typeActive) {
        if (normalize(job.type || job.job_type || '') !== normalize(jobType)) return false;
      }

      if (moreFilters.onlySaved && !job.saved) return false;

      if (postedWithinDays != null) {
        const days = parsePostedDays(job.posted || job.posted_at || '');
        if (days > postedWithinDays) return false;
      }

      if (minSalaryFilter != null || maxSalaryFilter != null) {
        const { min, max } = parseSalaryRange(job.salary || job.salary_range || '');
        if (minSalaryFilter != null && max < minSalaryFilter) return false;
        if (maxSalaryFilter != null && min > maxSalaryFilter) return false;
      }

      return true;
    });
  }, [jobs, searchTerm, selectedLocation, jobType, moreFilters, normalize, parseSalaryRange, parsePostedDays]);

  // ✅ Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(JOBS_PER_PAGE);
  }, [
    searchTerm,
    selectedLocation,
    jobType,
    moreFilters.postedWithin,
    moreFilters.minSalary,
    moreFilters.maxSalary,
    moreFilters.onlySaved,
  ]);

  // ✅ Paginated jobs to show
  const paginatedJobs = useMemo(
    () => filteredJobs.slice(0, visibleCount),
    [filteredJobs, visibleCount]
  );

  const canLoadMore = visibleCount < filteredJobs.length;

  const validateApplication = () => {
    const newErrors = {};

    if (!applicationData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (applicationData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters';
    }

    const salary = applicationData.expectedSalary.replace(/[₹Rs.,\s]/g, '');
    if (!salary) {
      newErrors.expectedSalary = 'Expected salary is required';
    } else if (isNaN(salary) || Number(salary) <= 0) {
      newErrors.expectedSalary = 'Enter a valid salary amount';
    }

    if (!applicationData.availability) {
      newErrors.availability = 'Please select a date';
    } else {
      const selectedDate = new Date(applicationData.availability);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.availability = 'Date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitApplication = () => {
    if (!validateApplication()) return;

    setShowApplyModal(false);
    setShowSuccessModal(true);

    setApplicationData({
      coverLetter: '',
      expectedSalary: '',
      availability: '',
    });

    setErrors({});
  };

  const resetMoreFilters = () => {
    setMoreFilters({
      postedWithin: 'any',
      minSalary: '',
      maxSalary: '',
      onlySaved: false,
    });
  };

  const activeMoreFiltersCount = useMemo(() => {
    let c = 0;
    if (moreFilters.postedWithin !== 'any') c += 1;
    if (moreFilters.minSalary) c += 1;
    if (moreFilters.maxSalary) c += 1;
    if (moreFilters.onlySaved) c += 1;
    return c;
  }, [moreFilters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Search Section */}
      <section className="bg-gradient-to-r from-teal-700 to-emerald-500 py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* ✅ Mobile-only smaller heading + description (desktop unchanged) */}
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-6">
            Find Your Perfect Healthcare Job
          </h1>
          <p className="text-sm md:text-lg text-emerald-100 mb-6 md:mb-8">
            Browse {jobs.length} open positions from top healthcare facilities
          </p>

          <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  list="all-job-titles"
                  placeholder="Job title or keyword"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-gray-700"
                />
                <datalist id="all-job-titles">
                  {popularJobTitles.map((title, idx) => (
                    <option key={idx} value={title} />
                  ))}
                </datalist>
              </div>

              <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-gray-700"
                >
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-600"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 380, behavior: 'smooth' })}
                className="bg-gradient-to-r from-teal-700 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-teal-800 hover:to-emerald-600 font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Positions</h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing <span className="font-semibold">{paginatedJobs.length}</span> of{' '}
                <span className="font-semibold">{filteredJobs.length}</span> jobs
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFiltersModal(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 relative"
            >
              <Filter className="w-5 h-5" />
              <span>More Filters</span>

              {activeMoreFiltersCount > 0 && (
                <span className="ml-2 text-xs bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                  {activeMoreFiltersCount}
                </span>
              )}
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
              <p className="text-lg font-semibold text-gray-900">No jobs found</p>
              <p className="text-gray-600 mt-2">Try clearing filters or changing keywords.</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLocation('');
                    setJobType('all');
                    resetMoreFilters();
                  }}
                  className="px-6 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-700"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowFiltersModal(true)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Edit More Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-emerald-700" />
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSaveJob(job.id)}
                      className={`${
                        job.saved ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                      title={job.saved ? 'Saved' : 'Save job'}
                      aria-label={job.saved ? 'Unsave job' : 'Save job'}
                    >
                      <Star className="w-5 h-5" fill={job.saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>

                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <span className="text-sm">{job.category}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{job.city}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                      {job.type}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-600 text-sm font-semibold">
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowDetailsModal(true);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                    >
                      View Details
                    </button>

                    <button
                      type="button"
                      onClick={() => handleApplyNow(job)}
                      className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredJobs.length > 0 && (
            <div className="text-center mt-12">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((v) => Math.min(v + JOBS_PER_PAGE, filteredJobs.length))
                }
                disabled={!canLoadMore}
                className={`bg-white border-2 px-8 py-3 rounded-lg font-medium transition ${
                  canLoadMore
                    ? 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canLoadMore ? 'Load More Jobs' : 'No More Jobs'}
              </button>

              <p className="text-xs text-gray-500 mt-3">
                Showing {paginatedJobs.length} of {filteredJobs.length} results
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ✅ More Filters Modal */}
      {showFiltersModal && (
        <Modal
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          title="More Filters"
        >
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Posted within</label>
              <select
                value={moreFilters.postedWithin}
                onChange={(e) => setMoreFilters((p) => ({ ...p, postedWithin: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-600 outline-none"
              >
                <option value="any">Any time</option>
                <option value="1">Last 1 day</option>
                <option value="3">Last 3 days</option>
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Salary range (monthly)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Min (e.g. 30000)"
                  value={moreFilters.minSalary}
                  onChange={(e) => setMoreFilters((p) => ({ ...p, minSalary: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Max (e.g. 80000)"
                  value={moreFilters.maxSalary}
                  onChange={(e) => setMoreFilters((p) => ({ ...p, maxSalary: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-600 outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tip: Salary is matched against the job’s salary range.
              </p>
            </div>

            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div>
                <p className="font-medium text-gray-800">Show saved jobs only</p>
                <p className="text-sm text-gray-500">Filter results to saved jobs</p>
              </div>
              <button
                type="button"
                onClick={() => setMoreFilters((p) => ({ ...p, onlySaved: !p.onlySaved }))}
                className={`w-12 h-7 rounded-full relative transition ${
                  moreFilters.onlySaved ? 'bg-emerald-700' : 'bg-gray-300'
                }`}
                aria-label="Toggle saved jobs only"
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition ${
                    moreFilters.onlySaved ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                type="button"
                onClick={resetMoreFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFiltersModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowFiltersModal(false)}
                  className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedJob && (
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title={selectedJob.title}
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <div className="flex items-center space-x-3">
                <Building2 className="w-8 h-8 text-emerald-700" />
                <div>
                  <p className="font-semibold text-gray-900">{selectedJob.company}</p>
                  <p className="text-sm text-gray-600">{selectedJob.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">{selectedJob.salary}</p>
                <p className="text-sm text-gray-600">{selectedJob.type}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
              <p className="text-gray-600 whitespace-pre-line">{selectedJob.description || 'No description provided.'}</p>
            </div>

            {selectedJob.requirements && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                <p className="text-gray-600 whitespace-pre-line">{selectedJob.requirements}</p>
              </div>
            )}

            {selectedJob.benefits && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
                <p className="text-gray-600 whitespace-pre-line">{selectedJob.benefits}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => handleApplyNow(selectedJob)}
                className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg"
              >
                Apply Now
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <Modal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          title={`Apply for ${selectedJob.title}`}
        >
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Cover Letter</label>
              <textarea
                rows="5"
                value={applicationData.coverLetter}
                onChange={(e) =>
                  setApplicationData({ ...applicationData, coverLetter: e.target.value })
                }
                placeholder="Tell us why you're a great fit for this role..."
                className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${
                  errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.coverLetter && (
                <p className="text-red-500 text-sm mt-1">{errors.coverLetter}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Expected Salary</label>
              <input
                type="text"
                value={applicationData.expectedSalary}
                onChange={(e) =>
                  setApplicationData({ ...applicationData, expectedSalary: e.target.value })
                }
                placeholder="Rs. 50,000"
                className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${
                  errors.expectedSalary ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expectedSalary && (
                <p className="text-red-500 text-sm mt-1">{errors.expectedSalary}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Available to join</label>
              <input
                type="date"
                value={applicationData.availability}
                onChange={(e) =>
                  setApplicationData({ ...applicationData, availability: e.target.value })
                }
                className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${
                  errors.availability ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.availability && (
                <p className="text-red-500 text-sm mt-1">{errors.availability}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
              >
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
      {showSuccessModal && selectedJob && (
        <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Success">
          <div className="flex flex-col items-center text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <p className="text-lg text-gray-800">
              Application submitted for <span className="font-semibold">{selectedJob.title}</span>!
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AllJobs;