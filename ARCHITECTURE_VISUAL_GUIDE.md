# 🏗️ MCARE Architecture Overview

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PUBLIC ACCESS                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │   HOME   │  │   JOBS   │  │  ABOUT   │  │ CONTACT  │        │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │
│         │              │                            │            │
│         └──────────────┴────────────────────────────┘            │
│                           │                                      │
│                    ┌──────▼──────┐                               │
│                    │  HEADER +   │                               │
│                    │   FOOTER    │                               │
│                    └─────────────┘                               │
└───────────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │ LOGIN / REGISTER│
                    │  (Role Select)  │
                    └───────┬────────┘
                            │
         ┌──────────────────┼──────────────────┬────────────┐
         │                  │                  │            │
    ┌────▼─────┐      ┌────▼─────┐      ┌────▼────┐  ┌───▼────┐
    │CANDIDATE │      │    HR    │      │EMPLOYEE │  │ ADMIN  │
    │   ROLE   │      │   ROLE   │      │  ROLE   │  │  ROLE  │
    └────┬─────┘      └────┬─────┘      └────┬────┘  └───┬────┘
         │                 │                  │           │
┌────────▼──────────┐ ┌────▼──────────┐ ┌────▼─────┐ ┌──▼──────┐
│  /candidate/*     │ │   /hr/*       │ │/employee/*│ │/admin/* │
│                   │ │               │ │          │ │         │
│ • Dashboard       │ │ • Dashboard   │ │• Dashboard│ │•Dashboard│
│ • Browse Jobs     │ │ • Manage Jobs │ │• Schedule │ │•Users   │
│ • Applications    │ │ • Post Job    │ │• Requests │ │•Jobs    │
│ • Resume          │ │ • Applications│ │• Profile  │ │•Analytics│
│ • Profile         │ │ • Candidates  │ │          │ │         │
└───────────────────┘ └───────────────┘ └──────────┘ └─────────┘
```

## Role-Based Navigation Flow

```
USER VISITS SITE
      │
      ▼
┌──────────┐
│   Home   │ ◄─── Public Access (Header + Footer)
└─────┬────┘
      │
      ▼
   Clicks "Login" or "Register"
      │
      ▼
┌─────────────────┐
│ Select Role:    │
│ ┌─────────────┐ │
│ │ Candidate   │ │
│ │ HR          │ │
│ │ Employee    │ │
│ │ Admin       │ │
│ └─────────────┘ │
└─────┬───────────┘
      │
      ▼
   Submit Credentials
      │
      ├─── ✅ Auth Success
      │         │
      │         ▼
      │   ┌──────────────────┐
      │   │ AuthContext      │
      │   │ saves user+role  │
      │   └────────┬─────────┘
      │            │
      │            ▼
      │     Role-Based Redirect
      │            │
      ├────────────┼────────────┬─────────────┐
      │            │            │             │
   Candidate      HR       Employee       Admin
      │            │            │             │
      ▼            ▼            ▼             ▼
/candidate/   /hr/        /employee/    /admin/
dashboard    dashboard    dashboard    dashboard
      │            │            │             │
      ▼            ▼            ▼             ▼
  [Sidebar]    [Sidebar]    [Sidebar]    [Sidebar]
  [Navbar]     [Navbar]     [Navbar]     [Navbar]
```

## Component Hierarchy

```
App.jsx (Root)
│
├─── Public Routes (with Header & Footer)
│    ├─── Home
│    ├─── AllJobs
│    ├─── JobDetail
│    ├─── About
│    ├─── Contact
│    ├─── Login (with role dropdown)
│    └─── Register (with role dropdown)
│
└─── Protected Routes (ProtectedRoute wrapper)
     │
     ├─── Candidate Routes (allowedRoles: ['candidate'])
     │    ├─── CandidateDashboard
     │    │    ├─── Sidebar (role="candidate")
     │    │    └─── Content
     │    ├─── BrowseJobs
     │    ├─── MyApplications
     │    ├─── ApplicationDetail
     │    ├─── MyResume
     │    └─── CandidateProfile
     │
     ├─── HR Routes (allowedRoles: ['hr'])
     │    ├─── HRDashboard
     │    │    ├─── Sidebar (role="hr")
     │    │    └─── Content
     │    ├─── ManageJobs
     │    ├─── CreateJob
     │    └─── ManageApplications
     │
     ├─── Employee Routes (allowedRoles: ['employee'])
     │    └─── EmployeeDashboard
     │         ├─── Sidebar (role="employee")
     │         └─── Content
     │
     └─── Admin Routes (allowedRoles: ['admin'])
          ├─── AdminDashboard
          │    ├─── Sidebar (role="admin")
          │    └─── Content
          └─── ManageUsers
```

## Authentication Flow

```
┌──────────────┐
│   Login Page │
└──────┬───────┘
       │
       ▼
┌────────────────────┐
│ User enters:       │
│ • Email/Username   │
│ • Password         │
│ • Selects Role     │  ◄─── 🔑 KEY CHANGE: Role Dropdown
└────────┬───────────┘
         │
         ▼
┌──────────────────────────┐
│ TODO: API Call           │
│ Currently: Mock Auth     │
│                          │
│ Create userData object:  │
│ {                        │
│   id: 1,                 │
│   email: "...",          │
│   fullName: "...",       │
│   role: "candidate"  ◄─── Selected Role
│ }                        │
└───────────┬──────────────┘
            │
            ▼
┌─────────────────────────┐
│ AuthContext.login()     │
│ • Sets user state       │
│ • Sets token           │
│ • Saves to localStorage │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Navigate based on role:     │
│                             │
│ switch(user.role) {         │
│   case 'candidate':         │
│     → /candidate/dashboard  │
│   case 'hr':                │
│     → /hr/dashboard         │
│   case 'employee':          │
│     → /employee/dashboard   │
│   case 'admin':             │
│     → /admin/dashboard      │
│ }                           │
└─────────────────────────────┘
```

## Protected Route Logic

```
User tries to access: /candidate/dashboard
                │
                ▼
    ┌───────────────────────┐
    │  ProtectedRoute       │
    │  Component Checks:    │
    └───────┬───────────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
isAuthenticated?   allowedRoles includes user.role?
     │                      │
  ┌──┴──┐              ┌────┴────┐
  │ NO  │              │   NO    │
  └──┬──┘              └────┬────┘
     │                      │
     ▼                      ▼
Navigate to      Navigate to correct
 /login          dashboard for user's
                 actual role
     │                      │
     └───────┬──────────────┘
             │
             ▼
           BOTH YES
             │
             ▼
    ┌────────────────┐
    │ Render Page!   │
    └────────────────┘
```

## Folder Structure

```
src/
├── App.jsx                    ◄─── Main router with role-based routes
├── main.jsx
├── index.css
│
├── pages/
│   ├── Login.jsx              ◄─── ✨ Updated with role dropdown
│   ├── Register.jsx           ◄─── ✨ Updated with role dropdown
│   ├── Home.jsx
│   ├── AllJobs.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   │
│   ├── candidate/             ◄─── 🔵 Candidate Pages
│   │   ├── CandidateDashboard.jsx
│   │   ├── BrowseJobs.jsx
│   │   ├── MyApplications.jsx
│   │   ├── ApplicationDetail.jsx
│   │   ├── MyResume.jsx
│   │   └── CandidateProfile.jsx
│   │
│   ├── hr/                    ◄─── 🟢 HR Pages
│   │   ├── HRDashboard.jsx
│   │   ├── ManageJobs.jsx
│   │   ├── CreateJob.jsx
│   │   └── ManageApplications.jsx
│   │
│   ├── employee/              ◄─── 🟣 Employee Pages
│   │   └── EmployeeDashboard.jsx
│   │
│   └── admin/                 ◄─── 🔴 Admin Pages
│       ├── AdminDashboard.jsx
│       └── ManageUsers.jsx
│
├── components/
│   ├── Navbar.jsx             ◄─── ✨ Updated with role-based menus
│   └── common/
│       ├── Header.jsx         ◄─── Uses Navbar
│       ├── Footer.jsx
│       ├── Logo.jsx
│       ├── Modal.jsx
│       └── Sidebar.jsx        ◄─── ✨ Dynamic role-based sidebar
│
├── context/
│   ├── AuthContext.jsx        ◄─── Manages user + role state
│   └── useAuth.js             ◄─── Hook to access auth
│
└── api/
    ├── authService.js         ◄─── TODO: Connect to real API
    └── ...other services
```

## Data Flow

```
┌─────────────┐
│  Login Form │
└──────┬──────┘
       │ (email, password, role)
       ▼
┌───────────────────┐
│ authService.login │ ◄─── TODO: Replace mock with real API
└─────────┬─────────┘
          │ (userData + token)
          ▼
┌──────────────────────┐
│  AuthContext.login   │
│  • setUser(userData) │
│  • setToken(token)   │
│  • localStorage.set  │
└──────────┬───────────┘
           │
           ▼
┌───────────────────────┐
│ All components can    │
│ access via useAuth(): │
│ • user.role           │
│ • isAuthenticated     │
│ • logout()            │
└───────────────────────┘
           │
    ┌──────┴──────┬─────────────┬──────────┐
    ▼             ▼             ▼          ▼
 Navbar       Sidebar    ProtectedRoute  Pages
(role menu)  (role menu) (role check)  (show user data)
```

## Role-Based Features Matrix

| Feature | Candidate | HR | Employee | Admin |
|---------|-----------|-----|----------|-------|
| Browse Jobs | ✅ | ❌ | ❌ | ✅ |
| Apply for Jobs | ✅ | ❌ | ❌ | ❌ |
| Post Jobs | ❌ | ✅ | ❌ | ✅ |
| Manage Applications | ✅ (Own) | ✅ (All) | ❌ | ✅ (All) |
| View Resume | ✅ (Own) | ✅ (Others) | ❌ | ✅ (All) |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| View Schedule | ❌ | ❌ | ✅ | ✅ |
| System Analytics | ❌ | ✅ (Limited) | ❌ | ✅ (Full) |

## Sidebar Menu Comparison

```
┌─────────────────┬──────────────┬──────────────┬──────────────┐
│   CANDIDATE     │      HR      │   EMPLOYEE   │    ADMIN     │
├─────────────────┼──────────────┼──────────────┼──────────────┤
│ 📊 Dashboard    │ 📊 Dashboard │ 📊 Dashboard │ 📊 Dashboard │
│ 💼 Browse Jobs  │ 💼 Jobs      │ 📅 Schedule  │ 👥 Users     │
│ 📝 Applications │ ➕ Post Job  │ 📋 Requests  │ 💼 Jobs      │
│ 📄 Resume       │ 📋 Apps      │ 📊 Attendance│ 🏥 Employers │
│ 💾 Saved Jobs   │ 👥 Candidates│ 💰 Payroll   │ 📊 Analytics │
│ 🔔 Alerts       │ 📊 Analytics │ 📧 Messages  │ ⚙️ Settings  │
│ 👥 Following    │ 💬 Messages  │ 👤 Profile   │ 🚪 Logout    │
│ 💬 Messages     │ ⚙️ Settings  │ ⚙️ Settings  │              │
│ 👤 Profile      │ 🚪 Logout    │ 🚪 Logout    │              │
│ ⚙️ Settings     │              │              │              │
│ 🚪 Logout       │              │              │              │
└─────────────────┴──────────────┴──────────────┴──────────────┘
```

## URL Routing Table

| Route | Role Required | Component | Description |
|-------|--------------|-----------|-------------|
| `/` | None | Home | Public landing page |
| `/jobs` | None | AllJobs | Public job listings |
| `/about` | None | About | About page |
| `/contact` | None | Contact | Contact form |
| `/login` | None | Login | Login with role selection |
| `/register` | None | Register | Register with role selection |
| `/candidate/dashboard` | candidate | CandidateDashboard | Candidate home |
| `/candidate/browse-jobs` | candidate | BrowseJobs | Job search |
| `/candidate/applications` | candidate | MyApplications | Application history |
| `/candidate/applications/:id` | candidate | ApplicationDetail | Single application |
| `/candidate/resume` | candidate | MyResume | Resume management |
| `/candidate/profile` | candidate | CandidateProfile | Profile edit |
| `/hr/dashboard` | hr | HRDashboard | HR home |
| `/hr/jobs` | hr | ManageJobs | Job postings management |
| `/hr/jobs/create` | hr | CreateJob | Create new job |
| `/hr/applications` | hr | ManageApplications | Review applications |
| `/employee/dashboard` | employee | EmployeeDashboard | Employee home |
| `/admin/dashboard` | admin | AdminDashboard | Admin home |
| `/admin/users` | admin | ManageUsers | User management |

---

## Key Changes Summary

### What Changed from Before:

1. **Login Page**:
   - ❌ Before: Role selection screen AFTER login
   - ✅ Now: Role dropdown DURING login

2. **Register Page**:
   - ❌ Before: User type selection cards (Candidate/Employer)
   - ✅ Now: Role dropdown with 4 options in one form

3. **Routing**:
   - ❌ Before: `/candidate-dashboard`, `/employer-dashboard`
   - ✅ Now: `/candidate/*`, `/hr/*`, `/employee/*`, `/admin/*`

4. **Navigation**:
   - ❌ Before: Static navbar for all users
   - ✅ Now: Dynamic navbar based on user role

5. **Organization**:
   - ❌ Before: All pages in flat `pages/` folder
   - ✅ Now: Pages organized by role in subfolders

---

**Architecture Status**: ✅ Complete  
**Last Updated**: January 9, 2026
