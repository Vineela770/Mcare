# 📋 MCARE Project Structure

## ✨ Complete Reorganization - January 9, 2026

This document outlines the new, professionally organized structure of the MCARE frontend application.

---

## 🗂️ Directory Structure

```
frontend/src/
├── pages/
│   ├── common/              # Public pages accessible to all
│   │   ├── Home.jsx        # Landing page with hero, features, jobs
│   │   ├── Login.jsx       # Login with role selector
│   │   ├── Register.jsx    # Registration with role selector
│   │   └── AllJobs.jsx     # Public job listings
│   │
│   ├── candidate/          # Candidate-specific pages
│   │   ├── Dashboard.jsx   # Candidate dashboard
│   │   ├── BrowseJobs.jsx  # Search and browse jobs
│   │   ├── Applications.jsx # Track applications
│   │   └── Resume.jsx      # Manage resume
│   │
│   ├── hr/                 # HR-specific pages
│   │   └── Dashboard.jsx   # HR dashboard
│   │
│   ├── employee/           # Employee-specific pages
│   │   └── Dashboard.jsx   # Employee dashboard
│   │
│   └── admin/              # Admin-specific pages
│       └── Dashboard.jsx   # Admin dashboard
│
├── components/
│   └── common/
│       ├── Sidebar.jsx     # Role-based navigation sidebar
│       ├── Header.jsx      # Top navigation bar
│       ├── Footer.jsx      # Footer component
│       ├── Logo.jsx        # Logo component
│       └── Modal.jsx       # Reusable modal
│
├── context/
│   ├── AuthContext.jsx     # Authentication context provider
│   └── useAuth.js          # Custom auth hook
│
├── api/                    # API service files
│   ├── authService.js
│   ├── jobService.js
│   ├── applicationService.js
│   └── ...
│
├── assets/                 # Static assets
│   ├── icons/
│   └── images/
│
├── styles/                 # Global styles
│
├── App.jsx                 # Main app with routes
├── main.jsx                # Entry point
└── index.css               # Global CSS
```

---

## 📄 Page Inventory

### **Common Pages (4 files)**
Located in: `src/pages/common/`

1. **Home.jsx** (330 lines)
   - Professional landing page
   - Hero section with search
   - Stats section
   - Popular categories
   - Featured jobs
   - How it works
   - CTA section
   - Footer

2. **Login.jsx** (198 lines)
   - Role selector dropdown
   - Email/password fields
   - Show/hide password
   - Remember me checkbox
   - Forgot password link
   - Redirects to role-specific dashboard

3. **Register.jsx** (350 lines)
   - Multi-field registration form
   - Role selector
   - Name, email, phone, location
   - Password confirmation
   - Terms & conditions checkbox
   - Two-column responsive layout

4. **AllJobs.jsx** (180 lines)
   - Public job listings
   - Search and filters
   - Job cards grid
   - Load more functionality

### **Candidate Pages (4 files)**
Located in: `src/pages/candidate/`

1. **Dashboard.jsx** (180 lines)
   - Stats cards (Applied, Shortlisted, Interviews, Profile Views)
   - Quick actions banner
   - Recent applications list
   - Quick links sidebar

2. **BrowseJobs.jsx** (165 lines)
   - Search bar with filters
   - Job type dropdown
   - Location search
   - Jobs grid with bookmark
   - Apply buttons

3. **Applications.jsx** (230 lines)
   - Stats overview
   - Status filter tabs
   - Applications list
   - Status badges
   - View details links

4. **Resume.jsx** (240 lines)
   - Profile completion indicator
   - Resume upload/download
   - Professional summary
   - Work experience section
   - Education section
   - Quick actions sidebar

### **HR Pages (1 file)**
Located in: `src/pages/hr/`

1. **Dashboard.jsx** (185 lines)
   - Stats cards (Active Jobs, Applications, Interviewed, Hired)
   - Quick actions banner
   - Recent applications
   - Weekly stats sidebar

### **Employee Pages (1 file)**
Located in: `src/pages/employee/`

1. **Dashboard.jsx** (160 lines)
   - Stats cards (Shifts, Hours, Earnings, Leave)
   - Quick actions banner
   - Upcoming schedule list
   - Shift details with status

### **Admin Pages (1 file)**
Located in: `src/pages/admin/`

1. **Dashboard.jsx** (145 lines)
   - System stats cards
   - Quick actions banner
   - Recent activity feed
   - User statistics

---

## 🎨 Design Patterns

### **Consistent Card Structure**
```jsx
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  {/* Card content */}
</div>
```

### **Stat Cards**
```jsx
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
  <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
    <Icon className="w-6 h-6 text-cyan-600" />
  </div>
  <div className="text-3xl font-bold text-gray-900">{value}</div>
  <div className="text-gray-600 text-sm">{label}</div>
</div>
```

### **Gradient Buttons**
```jsx
<button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium">
  Button Text
</button>
```

### **Status Badges**
```jsx
<span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
  Status
</span>
```

---

## 🛣️ Routing Structure

### **App.jsx Routes**

```jsx
// Public Routes
/ → Home
/jobs → AllJobs
/login → Login
/register → Register

// Candidate Routes (Protected)
/candidate/dashboard → Dashboard
/candidate/browse-jobs → BrowseJobs
/candidate/applications → Applications
/candidate/resume → Resume

// HR Routes (Protected)
/hr/dashboard → Dashboard

// Employee Routes (Protected)
/employee/dashboard → Dashboard

// Admin Routes (Protected)
/admin/dashboard → Dashboard
```

---

## 🧩 Component Structure

### **Sidebar Navigation**
- Dynamic menu based on user role
- Active state highlighting (gradient background)
- User info display at top
- Logout button at bottom
- Clean, minimal design

### **Protected Routes**
```jsx
<ProtectedRoute allowedRoles={['candidate']}>
  <CandidateDashboard />
</ProtectedRoute>
```

---

## 📊 File Statistics

### **Total Files by Category:**
- Common Pages: 4 files
- Candidate Pages: 4 files
- HR Pages: 1 file
- Employee Pages: 1 file
- Admin Pages: 1 file
- **Total Pages: 11 files**

### **Lines of Code:**
- Common Pages: ~1,058 lines
- Candidate Pages: ~815 lines
- Role Dashboards: ~490 lines
- **Total: ~2,363 lines** (excluding comments)

### **Component Reusability:**
- Sidebar: 1 component, 4 role menus
- Stat Cards: Consistent across all dashboards
- Status Badges: Reused in multiple pages

---

## 🎯 Benefits of New Structure

### ✅ **Organization**
- Clear separation by role
- Easy to find any page
- Intuitive folder names

### ✅ **Maintainability**
- Role-specific files grouped together
- Common pages in one place
- Easy to add new pages

### ✅ **Scalability**
- Each role can grow independently
- Clear patterns to follow
- Modular structure

### ✅ **Developer Experience**
- Quick navigation
- Predictable file locations
- Consistent code patterns

---

## 🚀 Adding New Pages

### **Step-by-Step Process:**

1. **Create the page file**
   ```bash
   # Example: Adding a new candidate page
   touch src/pages/candidate/NewPage.jsx
   ```

2. **Follow the design pattern**
   ```jsx
   import { useState } from 'react';
   import { Icon } from 'lucide-react';
   
   const NewPage = () => {
     return (
       <div className="p-6">
         <h1 className="text-3xl font-bold text-gray-900">Page Title</h1>
         {/* Page content */}
       </div>
     );
   };
   
   export default NewPage;
   ```

3. **Add route in App.jsx**
   ```jsx
   import NewPage from './pages/candidate/NewPage';
   
   <Route path="/candidate/new-page" element={
     <ProtectedRoute allowedRoles={['candidate']}>
       <NewPage />
     </ProtectedRoute>
   } />
   ```

4. **Add to Sidebar.jsx**
   ```jsx
   candidate: [
     // ...existing items
     { icon: Icon, label: 'New Page', path: '/candidate/new-page' },
   ]
   ```

---

## 📝 Code Quality

### **Consistent Patterns:**
✅ All pages use functional components  
✅ Hooks for state management  
✅ Consistent prop naming  
✅ Tailwind CSS classes  
✅ Lucide React icons  
✅ TODO comments for API integration  

### **Accessibility:**
✅ Semantic HTML  
✅ Proper heading hierarchy  
✅ Button/link distinction  
✅ Alt text ready for images  

---

## 🔄 Migration Notes

### **Changes Made:**
1. ❌ Removed all old scattered page files
2. ✅ Created organized folder structure
3. ✅ Moved common pages to `pages/common/`
4. ✅ Separated role-specific pages
5. ✅ Updated all imports in App.jsx
6. ✅ Rebuilt Sidebar with clean structure
7. ✅ Consistent styling across all pages

### **Files Removed:**
- About.jsx, Contact.jsx (old public pages)
- ForgotPassword.jsx, ResetPassword.jsx (not needed yet)
- All old role pages in root pages folder
- Duplicate/scattered page files

---

## 🎉 Result

**Professional, organized, scalable codebase ready for production development!**

✅ Clean folder structure  
✅ Consistent design patterns  
✅ Role-based organization  
✅ Easy to maintain and extend  
✅ Ready for API integration  

---

**Status**: ✅ Complete Reorganization Finished  
**Version**: 2.0.0  
**Date**: January 9, 2026
