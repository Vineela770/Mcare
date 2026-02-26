import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { useAuth } from './context/useAuth';


// Common Pages
import Home from './pages/common/Home';
import AllJobs from './pages/common/AllJobs';
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import ForgotPassword from './pages/common/ForgotPassword';
import ResetPassword from './pages/common/ResetPassword';
import About from './pages/common/About';
import Contact from './pages/common/Contact';

// Candidate Pages
import CandidateDashboard from './pages/candidate/Dashboard';
import BrowseJobs from './pages/candidate/BrowseJobs';
import Applications from './pages/candidate/Applications';
import ApplicationDetail from './pages/candidate/ApplicationDetail';
import JobDetail from './pages/candidate/JobDetail';
import Resume from './pages/candidate/Resume';
import SavedJobs from './pages/candidate/SavedJobs';
import Messages from './pages/candidate/Messages';
import Alerts from './pages/candidate/Alerts';
import Profile from './pages/candidate/Profile';
import CandidateEmployers from './pages/candidate/Employers';
import ChangePassword from './pages/candidate/change-password';
import DeleteProfile from "./pages/candidate/delete-profile";

// HR Pages
import HRDashboard from './pages/hr/Dashboard';
import PostJob from './pages/hr/PostJob';
import Jobs from './pages/hr/Jobs';
import Candidates from './pages/hr/Candidates';
import Interviews from './pages/hr/Interviews';
import HRSettings from './pages/hr/Settings';
import HRMessages from './pages/hr/Messages';
import HRApplications from './pages/hr/Applications';
import CandidateAlerts from './pages/hr/candidate-alerts';
import HRChangePassword from './pages/hr/HRchange-password';
import HRDeleteProfile from './pages/hr/HRdelete-profile';
import Packages from './pages/hr/packages';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UsersManagement from './pages/admin/UsersManagement';
import JobsManagement from './pages/admin/JobsManagement';
import Employers from './pages/admin/Employers';
import Reports from './pages/admin/Reports';
import ActivityLog from './pages/admin/ActivityLog';
import SystemSettings from './pages/admin/SystemSettings';

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();

  // ⏳ WAIT for auth to finish loading
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // 🔐 NOT logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 👮 ROLE CHECK
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}


function App() {
  return (
    
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<AllJobs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Candidate */}
        <Route
          path="/candidate/browse-jobs"
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <BrowseJobs />
            </ProtectedRoute>
          }
        />

        {/* ================= CANDIDATE ROUTES ================= */}
        <Route path="/candidate/dashboard" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateDashboard />
          </ProtectedRoute>
        } />
        <Route path="/candidate/browse-jobs" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <BrowseJobs />
          </ProtectedRoute>
        } />
        <Route path="/candidate/applications" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <Applications />
          </ProtectedRoute>
        } />
        <Route path="/candidate/application/:id" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <ApplicationDetail />
          </ProtectedRoute>
        } />
        <Route path="/candidate/job/:id" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <JobDetail />
          </ProtectedRoute>
        } />
        <Route path="/candidate/resume" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <Resume />
          </ProtectedRoute>
        } />
        <Route path="/candidate/saved-jobs" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <SavedJobs />
          </ProtectedRoute>
        } />
        <Route path="/candidate/messages" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <Messages />
          </ProtectedRoute>
        } />
        <Route path="/candidate/alerts" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <Alerts />
          </ProtectedRoute>
        } />
        <Route path="/candidate/profile" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/candidate/employers" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <CandidateEmployers />
          </ProtectedRoute>
        } />

        <Route path="/candidate/change-password" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <ChangePassword />
          </ProtectedRoute>
          } />

          <Route path="/candidate/delete-profile" element={
          <ProtectedRoute allowedRoles={['candidate']}>
            <DeleteProfile />
          </ProtectedRoute>
          } />

        {/* ================= HR ROUTES ================= */}
        <Route path="/hr/dashboard" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <HRDashboard />
          </ProtectedRoute>
        } />
        <Route path="/hr/post-job" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <PostJob />
          </ProtectedRoute>
        } />
        <Route path="/hr/jobs" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Jobs />
          </ProtectedRoute>
        } />
        <Route path="/hr/applications" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <HRApplications />
          </ProtectedRoute>
        } />
        <Route path="/hr/candidates" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Candidates />
          </ProtectedRoute>
        } />
        <Route path="/hr/interviews" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Interviews />
          </ProtectedRoute>
        } />
        <Route path="/hr/messages" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <HRMessages />
          </ProtectedRoute>
        } />
        <Route path="/hr/settings" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <HRSettings />
          </ProtectedRoute>
        } />
        <Route path="/hr/candidate-alerts" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <CandidateAlerts />
          </ProtectedRoute>
        } />
        <Route path="/hr/change-password" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <HRChangePassword />
          </ProtectedRoute>
        } />
        <Route path="/hr/delete-profile" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <HRDeleteProfile />
          </ProtectedRoute>
        } />
        <Route path="/hr/packages" element={
          <ProtectedRoute allowedRoles={['hr']}>
            <Packages />
          </ProtectedRoute>
        } />


        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'administrator']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['admin', 'administrator']}>
            <UsersManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/jobs" element={
          <ProtectedRoute allowedRoles={['admin', 'administrator']}>
            <JobsManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/employers" element={
          <ProtectedRoute allowedRoles={['admin', 'administrator']}>
            <Employers />
          </ProtectedRoute>
        } />
        <Route path="/admin/reports" element={
          <ProtectedRoute allowedRoles={['admin', 'administrator']}>
            <Reports />
          </ProtectedRoute>
        } />
        <Route path="/admin/activity" element={
          <ProtectedRoute allowedRoles={['admin', 'administrator']}>
            <ActivityLog />
          </ProtectedRoute>
        } />
        <Route path="/admin/settings" element={
          <ProtectedRoute allowedRoles={['admin', 'administrator']}>
            <SystemSettings />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
    
  );
}

export default App;