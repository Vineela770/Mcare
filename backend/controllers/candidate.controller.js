const pool = require("../config/db");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * 📂 FOLDER INITIALIZATION
 */
const uploadDirs = [
    path.join(__dirname, '../uploads/resumes/'),
    path.join(__dirname, '../uploads/cover_letters/'),
    path.join(__dirname, '../uploads/profile_photos/')
];

uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

/**
 * ⚙️ MULTER CONFIGURATIONS
 */
const resumeStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/resumes/')),
    filename: (req, file, cb) => {
        const userId = req.user ? req.user.id : 'anon';
        cb(null, `resume-${userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const cvStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/cover_letters/')),
    filename: (req, file, cb) => {
        const userId = req.user ? req.user.id : 'anon';
        cb(null, `cv-${userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const photoStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/profile_photos/')),
    filename: (req, file, cb) => {
        const userId = req.user ? req.user.id : 'anon';
        cb(null, `photo-${userId}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

exports.upload = multer({ 
    storage: resumeStorage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only PDF files for resumes or JPG/PNG for photos are allowed!'), false);
    }
});

exports.uploadPhoto = multer({ 
    storage: photoStorage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) cb(null, true);
        else cb(new Error('Only JPG, PNG or GIF are allowed for profile photos!'), false);
    }
});

exports.uploadCV = multer({ storage: cvStorage });

/**
 * 📊 1. Get Dashboard Stats & Profile Info
 */
exports.getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id; 
        
        // ✅ FETCH profile_photo_url from main users table for frontend circle sync
        const userQuery = await pool.query(
            `SELECT u.full_name, u.email, u.profile_photo_url, cp.* FROM users u 
             LEFT JOIN candidate_profiles cp ON u.id = cp.user_id 
             WHERE u.id = $1`,
            [userId]
        );
        
        if (userQuery.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = userQuery.rows[0];

        const parseJson = (data) => {
            try {
                if (!data) return [];
                return typeof data === 'string' ? JSON.parse(data) : data;
            } catch (e) { return []; }
        };

        const experienceArr = parseJson(user?.experience);
        const educationArr = parseJson(user?.education);

        let strength = 0;
        if (user?.resume_url) strength += 30;
        if (user?.professional_summary && user.professional_summary.trim().length >= 3) strength += 20;
        if (Array.isArray(experienceArr) && experienceArr.length > 0) strength += 25;
        if (Array.isArray(educationArr) && educationArr.length > 0) strength += 25;

        const statsResult = await pool.query(
            `SELECT 
                COUNT(*) as applied_count,
                COUNT(*) FILTER (WHERE LOWER(status) = 'shortlisted') as shortlisted_count,
                COUNT(*) FILTER (WHERE LOWER(status) = 'interview') as interview_count
             FROM applications WHERE user_id = $1`,
            [userId]
        );

        const recentAppsQuery = await pool.query(
            `SELECT a.id, j.title, j.company_name, j.location, a.status, a.applied_at 
             FROM applications a 
             JOIN jobs j ON a.job_id = j.id 
             WHERE a.user_id = $1 
             ORDER BY a.applied_at DESC LIMIT 3`,
            [userId]
        );

        res.json({
            success: true,
            stats: {
                jobsApplied: parseInt(statsResult.rows[0].applied_count) || 0,
                shortlisted: parseInt(statsResult.rows[0].shortlisted_count) || 0,
                interviews: parseInt(statsResult.rows[0].interview_count) || 0,
                profileViews: user?.profile_views || 0,
                skillPercentage: strength
            },
            profileData: user,
            recentApplications: recentAppsQuery.rows,
            userName: user.full_name || 'User'
        });
    } catch (err) {
        console.error("❌ Dashboard Error:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/**
 * 🔍 2. Get All Active Jobs
 */
exports.getAllJobs = async (req, res) => {
    try {
        const userId = req.user.id;
        const { keyword, location, type } = req.query;

        const queryParams = [userId];
        let paramCount = 1;
        let jobsWhereExtra = '';
        let hrWhereExtra = '';

        if (keyword && keyword.trim()) {
            paramCount++;
            jobsWhereExtra += ` AND (j.title ILIKE $${paramCount} OR j.company_name ILIKE $${paramCount})`;
            hrWhereExtra  += ` AND (mjp.title ILIKE $${paramCount} OR mjp.department ILIKE $${paramCount})`;
            queryParams.push(`%${keyword.trim()}%`);
        }

        if (location && location !== 'All Locations') {
            paramCount++;
            jobsWhereExtra += ` AND j.location ILIKE $${paramCount}`;
            hrWhereExtra  += ` AND mjp.location ILIKE $${paramCount}`;
            queryParams.push(`%${location}%`);
        }

        if (type && type !== 'All Types' && type !== 'all') {
            paramCount++;
            jobsWhereExtra += ` AND j.job_type ILIKE $${paramCount}`;
            hrWhereExtra  += ` AND mjp.job_type ILIKE $${paramCount}`;
            queryParams.push(`%${type}%`);
        }

        const queryText = `
            SELECT * FROM (
                SELECT
                    j.id,
                    j.title,
                    COALESCE(j.company_name, 'MCARE') AS company,
                    j.location,
                    j.job_type AS type,
                    CASE
                        WHEN j.min_salary IS NOT NULL AND j.min_salary != ''
                        THEN CONCAT(j.min_salary, ' - ', j.max_salary)
                        ELSE 'Negotiable'
                    END AS salary,
                    j.description,
                    j.requirements,
                    TO_CHAR(j.created_at, 'DD Mon YYYY') AS posted,
                    j.created_at,
                    CASE WHEN s.id IS NOT NULL THEN TRUE ELSE FALSE END AS saved,
                    CASE WHEN a.id IS NOT NULL THEN TRUE ELSE FALSE END AS already_applied,
                    'jobs' AS source
                FROM jobs j
                LEFT JOIN saved_jobs s ON j.id = s.job_id AND s.user_id = $1
                LEFT JOIN applications a ON j.id = a.job_id AND a.user_id = $1
                WHERE j.is_active = true${jobsWhereExtra}

                UNION ALL

                SELECT
                    mjp.id,
                    mjp.title,
                    COALESCE(mjp.department, 'MCARE') AS company,
                    mjp.location,
                    mjp.job_type AS type,
                    COALESCE(mjp.salary, 'Negotiable') AS salary,
                    mjp.description,
                    mjp.requirements,
                    TO_CHAR(mjp.created_at, 'DD Mon YYYY') AS posted,
                    mjp.created_at,
                    FALSE AS saved,
                    FALSE AS already_applied,
                    'hr_post' AS source
                FROM mcare_job_posts mjp
                WHERE mjp.status = 'active'${hrWhereExtra}
            ) AS all_jobs
            ORDER BY created_at DESC
        `;

        const result = await pool.query(queryText, queryParams);

        res.json({
            success: true,
            count: result.rows.length,
            jobs: result.rows
        });
    } catch (err) {
        console.error("❌ Fetch Jobs Error:", err.message);
        res.status(500).json({ success: false, message: "Error fetching jobs" });
    }
};

/**
 * 📝 3. Apply to Job
 */
exports.applyToJob = async (req, res) => {
    try {
        const { job_id, hr_job_id, source, availability, cover_letter } = req.body;
        const userId = req.user.id;

        const isHrPost = source === 'hr_post' || !!hr_job_id;
        const finalJobId   = isHrPost ? null : (job_id || null);
        const finalHrJobId = isHrPost ? (hr_job_id || job_id) : null;

        // Duplicate check
        const dupCheck = await pool.query(
            `SELECT id FROM applications WHERE user_id = $1
             AND ($2::int IS NULL OR job_id = $2)
             AND ($3::int IS NULL OR hr_job_id = $3)`,
            [userId, finalJobId, finalHrJobId]
        );
        if (dupCheck.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Already applied to this job' });
        }

        await pool.query(
            `INSERT INTO applications (job_id, hr_job_id, user_id, cover_letter_path, availability, status, applied_at)
             VALUES ($1, $2, $3, $4, $5, 'Under Review', NOW())`,
            [finalJobId, finalHrJobId, userId, cover_letter || null, availability || null]
        );

        res.status(201).json({ success: true, message: 'Application submitted!' });
    } catch (err) {
        console.error('Apply error:', err.message);
        res.status(500).json({ success: false, message: 'Error submitting application' });
    }
};

/**
 * 📋 4. Get My Application History
 */
exports.getMyApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        const apps = await pool.query(
            `SELECT
               a.id,
               COALESCE(j.title,  mjp.title)  AS title,
               COALESCE(j.company_name, mjp.department, 'MCARE') AS company_name,
               COALESCE(j.location, mjp.location) AS location,
               COALESCE(j.job_type, mjp.job_type) AS job_type,
               a.status,
               a.applied_at
             FROM applications a
             LEFT JOIN jobs j ON j.id = a.job_id
             LEFT JOIN mcare_job_posts mjp ON mjp.id = a.hr_job_id
             WHERE a.user_id = $1
             ORDER BY a.applied_at DESC`,
            [userId]
        );
        res.json(apps.rows);
    } catch (err) {
        console.error('getMyApplications error:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching applications' });
    }
};

/**
 * 🏢 5. Get Job By ID
 */
exports.getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        // Try jobs table first
        let result = await pool.query(
            `SELECT id, title, company_name AS company, location, job_type AS type,
                    CASE WHEN min_salary IS NOT NULL AND min_salary != ''
                         THEN CONCAT(min_salary, ' - ', max_salary) ELSE 'Negotiable' END AS salary,
                    description, requirements,
                    TO_CHAR(created_at, 'DD Mon YYYY') AS posted, 'jobs' AS source
             FROM jobs WHERE id = $1`,
            [id]
        );

        // Fall back to mcare_job_posts
        if (result.rows.length === 0) {
            result = await pool.query(
                `SELECT id, title, COALESCE(department, 'MCARE') AS company, location,
                        job_type AS type, COALESCE(salary, 'Negotiable') AS salary,
                        description, requirements,
                        TO_CHAR(created_at, 'DD Mon YYYY') AS posted, 'hr_post' AS source
                 FROM mcare_job_posts WHERE id = $1`,
                [id]
            );
        }

        if (result.rows.length === 0) return res.status(404).json({ success: false, message: "Job not found" });
        res.json({ success: true, job: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * 👁️ 6. Get Application Details
 */
exports.getApplicationDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT
               a.id,
               a.status,
               a.applied_at,
               a.cover_letter_path,
               a.availability,
               COALESCE(j.title,  mjp.title)  AS job_title,
               COALESCE(j.company_name, mjp.department, 'MCARE') AS company_name,
               COALESCE(j.location, mjp.location) AS location,
               COALESCE(j.job_type, mjp.job_type) AS job_type,
               COALESCE(j.description, mjp.description) AS description,
               COALESCE(j.requirements, mjp.requirements) AS requirements,
               mjp.benefits
             FROM applications a
             LEFT JOIN jobs j ON j.id = a.job_id
             LEFT JOIN mcare_job_posts mjp ON mjp.id = a.hr_job_id
             WHERE a.id = $1 AND a.user_id = $2`,
            [id, userId]
        );
        if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Application not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('getApplicationDetails error:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching application details' });
    }
};

/**
 * 📄 6.5. Get User Resume/Profile Data
 */
exports.getUserResumeData = async (req, res) => {
    try {
        const userId = req.user.id;

        const userQuery = await pool.query(
            `SELECT u.full_name, u.email, u.profile_photo_url, cp.* FROM users u 
             LEFT JOIN candidate_profiles cp ON u.id = cp.user_id 
             WHERE u.id = $1`,
            [userId]
        );

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const user = userQuery.rows[0];

        const parseJson = (data) => {
            try {
                if (!data) return [];
                return typeof data === 'string' ? JSON.parse(data) : data;
            } catch (e) { return []; }
        };

        const experiences = parseJson(user?.experience);
        const educations = parseJson(user?.education);

        res.json({
            success: true,
            summary: user?.professional_summary || '',
            experiences: experiences,
            educations: educations,
            resumeUrl: user?.resume_url || null,
            resumeFileName: user?.resume_url ? user.resume_url.split('/').pop() : null,
            profileCompletion: 0 // Calculate if needed
        });
    } catch (err) {
        console.error("❌ Get Resume Error:", err.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/**
 * 📄 7. Update Detailed Profile & Resume (✅ FIX FOR STATIC PATHS)
 */
exports.updateResumeData = async (req, res) => {
    try {
        const userId = req.user.id;
        const { 
            summary, experience, education, phone_number, location, highest_qualification, 
            additional_qualification, gender, years_of_experience, specialization, 
            certifications, languages, availability, expected_salary, notice_period, 
            preferred_city, current_city, teaching_interest, dob 
        } = req.body;
        
        let resumeUrl = null;
        let photoUrl = null;

        // ✅ RE-MAPPED TO MATCH STATIC SERVER (Removed redundant /uploads)
        if (req.file) {
            if (req.file.fieldname === 'photo') photoUrl = `/profile_photos/${req.file.filename}`;
            if (req.file.fieldname === 'resume') resumeUrl = `/resumes/${req.file.filename}`;
        }
        if (req.files) {
            if (req.files['resume']?.[0]) resumeUrl = `/resumes/${req.files['resume'][0].filename}`;
            if (req.files['photo']?.[0]) photoUrl = `/profile_photos/${req.files['photo'][0].filename}`;
        }

        const expData = (experience && experience !== 'undefined') ? experience : null;
        const eduData = (education && education !== 'undefined') ? education : null;

        // ✅ 1. Update USERS table for Global Photo Visibility
        if (photoUrl) {
            await pool.query("UPDATE users SET profile_photo_url = $1 WHERE id = $2", [photoUrl, userId]);
        }

        // ✅ 2. Update Detailed CANDIDATE_PROFILES
        await pool.query(
            `UPDATE candidate_profiles SET 
                professional_summary = COALESCE($1, professional_summary), 
                experience = COALESCE($2::jsonb, experience), 
                education = COALESCE($3::jsonb, education), 
                resume_url = COALESCE($4, resume_url),
                phone_number = COALESCE($5, phone_number),
                location = COALESCE($6, location),
                highest_qualification = COALESCE($7, highest_qualification),
                additional_qualification = COALESCE($8, additional_qualification),
                gender = COALESCE($9, gender),
                years_of_experience = COALESCE($10, years_of_experience),
                specialization = COALESCE($11, specialization),
                certifications = COALESCE($12, certifications),
                languages = COALESCE($13, languages),
                availability = COALESCE($14, availability),
                expected_salary = COALESCE($15, expected_salary),
                notice_period = COALESCE($16, notice_period),
                preferred_city = COALESCE($17, preferred_city),
                current_city = COALESCE($18, current_city),
                teaching_interest = COALESCE($19, teaching_interest),
                profile_photo_url = COALESCE($20, profile_photo_url),
                dob = COALESCE($21, dob),
                updated_at = NOW()
             WHERE user_id = $22`,
            [
                summary || null, expData, eduData, resumeUrl, 
                phone_number || null, location || null, highest_qualification || null, 
                additional_qualification || null, gender || null, years_of_experience || null, 
                specialization || null, certifications || null, languages || null, availability || null, 
                expected_salary || null, notice_period || null, preferred_city || null, 
                current_city || null, teaching_interest || null, photoUrl, dob || null, userId
            ]
        );

        res.json({ success: true, message: "Profile updated successfully!", photoPath: photoUrl });
    } catch (err) {
        console.error("❌ Update Error:", err.message);
        res.status(500).json({ success: false, message: "Database Update Error: " + err.message });
    }
};

/**
 * 💖 8. Save Job
 */
exports.saveJob = async (req, res) => {
    try {
        await pool.query("INSERT INTO saved_jobs (user_id, job_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", [req.user.id, req.body.job_id]);
        res.json({ success: true, message: "Job saved!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Save failed" });
    }
};

/**
 * 📌 9. Get Saved Jobs
 */
exports.getSavedJobs = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT j.* FROM jobs j JOIN saved_jobs s ON j.id = s.job_id WHERE s.user_id = $1", 
            [req.user.id]
        );
        res.json({ success: true, jobs: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: "Fetch failed" });
    }
};

/**
 * 🗑️ 10. Delete Saved Job
 */
exports.deleteSavedJob = async (req, res) => {
    try {
        await pool.query("DELETE FROM saved_jobs WHERE user_id = $1 AND job_id = $2", [req.user.id, req.params.id]);
        res.json({ success: true, message: "Deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Delete failed" });
    }
};

/**
 * 🏥 11. Search Hospitals
 */
exports.searchHospitals = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json({ success: true, hospitals: [] });
        const result = await pool.query(
            `SELECT id, full_name, profile_photo_url as photo_url FROM users WHERE role = 'hospital' AND full_name ILIKE $1 LIMIT 5`,
            [`%${query}%`]
        );
        res.json({ success: true, hospitals: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: "Search failed" });
    }
};

/**
 * 🔔 12. Create New Job Alert
 */
exports.createAlert = async (req, res) => {
    try {
        const { title, keywords, location, jobType, frequency } = req.body;
        const userId = req.user.id;
        const idResult = await pool.query("SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM job_alerts");
        const nextId = idResult.rows[0].next_id;
        const result = await pool.query(
            `INSERT INTO job_alerts (id, user_id, title, keyword, location, job_type, frequency, is_active) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *`,
            [nextId, userId, title, keywords, location, jobType, frequency]
        );
        res.status(201).json({ success: true, alert: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to create alert" });
    }
};

/**
 * 📂 13. Get All Alerts
 */
exports.getAlerts = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM job_alerts WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);
        res.json({ success: true, alerts: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch alerts" });
    }
};

/**
 * 🔘 14. Toggle Alert Status
 */
exports.toggleAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_active } = req.body;
        await pool.query("UPDATE job_alerts SET is_active = $1 WHERE id = $2 AND user_id = $3", [is_active, id, req.user.id]);
        res.json({ success: true, message: "Status updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Update failed" });
    }
};

/**
 * 🗑️ 15. Delete Job Alert
 */
exports.deleteAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await pool.query(
            "DELETE FROM job_alerts WHERE id = $1 AND user_id = $2 RETURNING id",
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Alert not found" });
        }

        res.json({ success: true, message: "Alert deleted successfully" });
    } catch (err) {
        console.error("❌ Delete Alert Error:", err.message);
        res.status(500).json({ success: false, message: "Failed to delete alert" });
    }
};

/**
 * 🔄 16. Update Existing Job Alert (FIXED FOR PENCIL ICON)
 */
exports.updateAlert = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, keywords, location, jobType, frequency } = req.body;
        const userId = req.user.id;

        const result = await pool.query(
            `UPDATE job_alerts SET 
                title = $1, 
                keyword = $2, 
                location = $3, 
                job_type = $4, 
                frequency = $5,
                updated_at = NOW()
             WHERE id = $6 AND user_id = $7
             RETURNING *`,
            [title, keywords, location, jobType, frequency, id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Alert not found" });
        }

        res.json({ success: true, message: "Alert updated successfully!", alert: result.rows[0] });
    } catch (err) {
        console.error("❌ Update Alert Error:", err.message);
        res.status(500).json({ success: false, message: "Failed to update alert" });
    }
};

/**
 * 👤 Get Basic Profile — for the candidate Profile settings page
 */
exports.getBasicProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT u.id, u.full_name, u.email, u.phone_number, u.location, u.profile_photo_url,
                    cp.gender, cp.dob, cp.qualification, cp.highest_qualification,
                    cp.current_experience, cp.current_position, cp.preferred_job_type,
                    cp.preferred_location, cp.expected_salary, cp.willing_to_relocate,
                    cp.interested_in_teaching, cp.certifications, cp.professional_summary,
                    cp.resume_url
             FROM users u
             LEFT JOIN candidate_profiles cp ON cp.user_id = u.id
             WHERE u.id = $1`,
            [userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, profile: result.rows[0] });
    } catch (err) {
        console.error("❌ getBasicProfile Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * 👤 Update Basic Profile (name, phone, location, candidate profile fields)
 * Used by the candidate Profile settings page
 */
exports.updateBasicProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            full_name, phone_number, location,
            gender, dob,
            qualification, highest_qualification, current_experience,
            current_position, preferred_job_type, preferred_location,
            expected_salary, willing_to_relocate, interested_in_teaching,
            certifications, professional_summary,
        } = req.body;

        // Update users table
        await pool.query(
            `UPDATE users SET
               full_name    = COALESCE($1, full_name),
               phone_number = COALESCE($2, phone_number),
               location     = COALESCE($3, location),
               updated_at   = NOW()
             WHERE id = $4`,
            [full_name || null, phone_number || null, location || null, userId]
        );

        // Upsert candidate_profiles using correct column names from migration
        await pool.query(
            `INSERT INTO candidate_profiles
               (user_id, gender, dob, qualification, highest_qualification,
                current_experience, current_position, preferred_job_type,
                preferred_location, expected_salary, willing_to_relocate,
                interested_in_teaching, certifications, professional_summary)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
             ON CONFLICT (user_id) DO UPDATE SET
               gender               = COALESCE(EXCLUDED.gender,               candidate_profiles.gender),
               dob                  = COALESCE(EXCLUDED.dob,                  candidate_profiles.dob),
               qualification        = COALESCE(EXCLUDED.qualification,        candidate_profiles.qualification),
               highest_qualification= COALESCE(EXCLUDED.highest_qualification,candidate_profiles.highest_qualification),
               current_experience   = COALESCE(EXCLUDED.current_experience,   candidate_profiles.current_experience),
               current_position     = COALESCE(EXCLUDED.current_position,     candidate_profiles.current_position),
               preferred_job_type   = COALESCE(EXCLUDED.preferred_job_type,   candidate_profiles.preferred_job_type),
               preferred_location   = COALESCE(EXCLUDED.preferred_location,   candidate_profiles.preferred_location),
               expected_salary      = COALESCE(EXCLUDED.expected_salary,      candidate_profiles.expected_salary),
               willing_to_relocate  = COALESCE(EXCLUDED.willing_to_relocate,  candidate_profiles.willing_to_relocate),
               interested_in_teaching = COALESCE(EXCLUDED.interested_in_teaching, candidate_profiles.interested_in_teaching),
               certifications       = COALESCE(EXCLUDED.certifications,       candidate_profiles.certifications),
               professional_summary = COALESCE(EXCLUDED.professional_summary, candidate_profiles.professional_summary),
               updated_at           = NOW()`,
            [
                userId,
                gender || null, dob || null,
                qualification || null, highest_qualification || null,
                current_experience || null, current_position || null,
                preferred_job_type || null, preferred_location || null,
                expected_salary || null,
                willing_to_relocate != null ? willing_to_relocate : null,
                interested_in_teaching != null ? interested_in_teaching : null,
                certifications || null, professional_summary || null,
            ]
        );

        res.json({ success: true, message: "Profile updated successfully" });
    } catch (err) {
        console.error("❌ updateBasicProfile Error:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};