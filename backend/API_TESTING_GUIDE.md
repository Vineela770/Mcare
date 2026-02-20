# MCARE Backend API Testing Guide

## ✅ Backend Status
- **Server**: Running on http://localhost:3000
- **Database**: mcare_db (PostgreSQL)
- **Environment**: Development
- **Authentication**: JWT with 7-day expiration

---

## 🔐 Authentication Endpoints

### 1. Register
**Endpoint**: `POST /api/auth/register`

#### Candidate Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Candidate",
    "email": "john.candidate@example.com",
    "phoneNumber": "1234567890",
    "location": "New York, NY",
    "password": "TestPass123!",
    "confirmPassword": "TestPass123!",
    "role": "candidate"
  }'
```

#### HR Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Sarah HR Manager",
    "email": "sarah.hr@hospital.com",
    "phoneNumber": "9876543210",
    "location": "Boston, MA",
    "password": "HRPass123!",
    "confirmPassword": "HRPass123!",
    "role": "hr",
    "companyName": "Boston General Hospital",
    "companyWebsite": "https://bostongeneral.com"
  }'
```

#### Admin Registration
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Admin User",
    "email": "admin@mcare.com",
    "phoneNumber": "5555555555",
    "location": "San Francisco, CA",
    "password": "AdminPass123!",
    "confirmPassword": "AdminPass123!",
    "role": "admin"
  }'
```

### 2. Login
**Endpoint**: `POST /api/auth/login`

#### Candidate Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.candidate@example.com",
    "password": "TestPass123!",
    "role": "candidate"
  }'
```

#### HR Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sarah.hr@hospital.com",
    "password": "HRPass123!",
    "role": "hr"
  }'
```

#### Admin Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mcare.com",
    "password": "AdminPass123!",
    "role": "admin"
  }'
```

### 3. Get Current User
**Endpoint**: `GET /api/auth/me`

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 👤 Candidate Endpoints

### 1. Get Profile
```bash
curl -X GET http://localhost:3000/api/candidate/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Update Profile
```bash
curl -X PUT http://localhost:3000/api/candidate/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Experienced healthcare professional",
    "skills": ["Patient Care", "EMR Systems", "CPR Certified"],
    "experience_years": 5,
    "education": "BSN - Nursing",
    "current_position": "Registered Nurse",
    "expected_salary_min": 60000,
    "expected_salary_max": 80000
  }'
```

### 3. Browse Jobs
```bash
# All jobs
curl -X GET http://localhost:3000/api/candidate/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# With filters
curl -X GET "http://localhost:3000/api/candidate/jobs?location=New%20York&jobType=full-time&minSalary=50000" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Save Job
```bash
curl -X POST http://localhost:3000/api/candidate/jobs/1/save \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Get Saved Jobs
```bash
curl -X GET http://localhost:3000/api/candidate/saved-jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 6. Apply for Job
```bash
curl -X POST http://localhost:3000/api/candidate/jobs/1/apply \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cover_letter": "I am very interested in this position..."
  }'
```

### 7. Get Applications
```bash
curl -X GET http://localhost:3000/api/candidate/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🏥 HR Endpoints

### 1. Get Profile
```bash
curl -X GET http://localhost:3000/api/hr/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Update Profile
```bash
curl -X PUT http://localhost:3000/api/hr/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Boston General Hospital",
    "company_website": "https://bostongeneral.com",
    "company_size": "500-1000",
    "industry": "Healthcare",
    "company_description": "Leading healthcare provider in Boston",
    "position_title": "HR Manager"
  }'
```

### 3. Post Job
```bash
curl -X POST http://localhost:3000/api/hr/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Registered Nurse",
    "description": "We are looking for an experienced RN...",
    "requirements": "BSN required, 2+ years experience",
    "location": "Boston, MA",
    "job_type": "full-time",
    "salary_min": 60000,
    "salary_max": 80000,
    "benefits": "Health insurance, 401k, PTO",
    "application_deadline": "2026-03-01"
  }'
```

### 4. Get Posted Jobs
```bash
curl -X GET http://localhost:3000/api/hr/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Update Job
```bash
curl -X PUT http://localhost:3000/api/hr/jobs/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Registered Nurse",
    "salary_max": 90000
  }'
```

### 6. Get Applications
```bash
curl -X GET http://localhost:3000/api/hr/applications \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Update Application Status
```bash
curl -X PATCH http://localhost:3000/api/hr/applications/1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "interview"
  }'
```
**Valid statuses**: `pending`, `reviewed`, `interview`, `offered`, `rejected`, `accepted`

---

## 👨‍💼 Admin Endpoints

### 1. Get All Users
```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Get All Jobs
```bash
curl -X GET http://localhost:3000/api/admin/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. Get Statistics
```bash
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Update User Status
```bash
curl -X PATCH http://localhost:3000/api/admin/users/1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "is_active": false
  }'
```

---

## 🔍 Health Check
```bash
curl http://localhost:3000/health
```

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## 🧪 Testing Workflow

### 1. Test Authentication
```bash
# Register users for each role
# Login and save the JWT tokens
```

### 2. Test Candidate Flow
```bash
# Login as candidate
# Update profile
# Browse jobs
# Save jobs
# Apply for jobs
# Check applications
```

### 3. Test HR Flow
```bash
# Login as HR
# Update company profile
# Post new jobs
# View applications
# Update application status
```

### 4. Test Admin Flow
```bash
# Login as admin
# View all users
# View all jobs
# Check statistics
# Manage user status
```

---

## 🗃️ Database Verification

### Check Users
```bash
PGPASSWORD='Vineela0704' /Applications/Postgres.app/Contents/Versions/18/bin/psql \
  -U uvineelareddy -d mcare_db \
  -c "SELECT id, email, full_name, role, is_active FROM users;"
```

### Check Jobs
```bash
PGPASSWORD='Vineela0704' /Applications/Postgres.app/Contents/Versions/18/bin/psql \
  -U uvineelareddy -d mcare_db \
  -c "SELECT id, title, location, job_type, status FROM jobs;"
```

### Check Applications
```bash
PGPASSWORD='Vineela0704' /Applications/Postgres.app/Contents/Versions/18/bin/psql \
  -U uvineelareddy -d mcare_db \
  -c "SELECT id, user_id, job_id, status, applied_at FROM applications;"
```

---

## 🔑 Test Credentials

| Role      | Email                          | Password       |
|-----------|--------------------------------|----------------|
| Candidate | john.candidate@example.com     | TestPass123!   |
| HR        | sarah.hr@hospital.com          | HRPass123!     |
| Admin     | admin@mcare.com                | AdminPass123!  |

---

## 🚀 Next Steps

1. ✅ Backend fully functional and tested
2. 🔄 Connect frontend React app to backend API
3. 📱 Test all UI forms with real API calls
4. 🎨 Add loading states and error handling
5. 📁 Implement resume file uploads
6. 💬 Build real-time messaging system

---

## 📞 Support

For issues or questions:
- Check server logs in terminal
- Verify JWT token is included in requests
- Ensure proper role authorization
- Check database connection

**Server Status**: ✅ Running on port 3000
**Database Status**: ✅ Connected to mcare_db
**Authentication**: ✅ JWT with role-based access
