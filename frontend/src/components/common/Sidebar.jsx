import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  Settings,
  Users,
  Heart,
  MessageSquare,
  Bell,
  Building2,
  List,
  Lock,
  Trash2,
  LogOut,
  PlusCircle,
  UserCheck,
  CreditCard,
  CalendarCheck,
  Copy,
  Check
} from 'lucide-react';

// ✅ Updated skillPercentage default to 60 to match dashboard state
const Sidebar = ({ skillPercentage = 60, userName }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  const targetPercentage = 87;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // ✅ Function to handle copying ID to clipboard
  const handleCopyId = () => {
    const fullId = `MCARE-${user?.id || '001'}`;
    navigator.clipboard.writeText(fullId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset icon after 2 seconds
  };

  const menuItems = {
    candidate: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/candidate/dashboard' },
      { icon: Settings, label: 'Profile', path: '/candidate/profile' },
      { icon: FileText, label: 'My Applied', path: '/candidate/applications' },
      { icon: User, label: 'My Resume', path: '/candidate/resume' },
      { icon: Bell, label: 'Job Alerts', path: '/candidate/alerts' },
      { icon: Briefcase, label: 'Following Employers', path: '/candidate/employers' },
      { icon: Heart, label: 'Shortlisted Jobs', path: '/candidate/saved-jobs' },
      { icon: MessageSquare, label: 'Messages', path: '/candidate/messages' },
      { icon: Lock, label: 'Change Password', path: '/candidate/change-password' },
      { icon: Trash2, label: 'Delete Profile', path: '/candidate/delete-profile' },
    ],
    hr: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/hr/dashboard' },
      { icon: User, label: 'Profile', path: '/hr/settings' },
      { icon: Briefcase, label: 'My Jobs', path: '/hr/jobs' },
      { icon: PlusCircle, label: 'Submit Job', path: '/hr/post-job' },
      { icon: FileText, label: 'Applicant Jobs', path: '/hr/applications' },
      { icon: UserCheck, label: 'Shortlisted Candidates', path: '/hr/candidates' },
      { icon: Bell, label: 'Candidate Alerts', path: '/hr/candidate-alerts' },
      { icon: CreditCard, label: 'Packages', path: '/hr/packages' },
      { icon: MessageSquare, label: 'Messages', path: '/hr/messages' },
      { icon: CalendarCheck, label: 'Meetings Employer', path: '/hr/interviews' },
      { icon: Lock, label: 'Change Password', path: '/hr/change-password' },
      { icon: Trash2, label: 'Delete Profile', path: '/hr/delete-profile' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: Users, label: 'Users Management', path: '/admin/users' },
      { icon: Briefcase, label: 'Jobs Management', path: '/admin/jobs' },
      { icon: Building2, label: 'Employers', path: '/admin/employers' },
      { icon: FileText, label: 'Reports', path: '/admin/reports' },
      { icon: List, label: 'Activity Log', path: '/admin/activity' },
      { icon: Settings, label: 'System Settings', path: '/admin/settings' },
    ],
  };

  const currentMenu = menuItems[user?.role] || [];
  const displayName = userName || user?.full_name || user?.name || 'Manoj Kumar';

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-40">
      {/* Logo & User Info */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center space-x-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">MCARE</span>
        </Link>

        {/* Dynamic User Profile Section */}
        <div className="flex items-center space-x-3 mt-4 text-left">
          {/* ✅ FIXED: Enhanced Profile Photo logic with explicit URL prefixing and cache-busting key */}
          <div className="w-12 h-12 rounded-full overflow-hidden border border-cyan-200 shadow-sm flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100 flex-shrink-0">
            {user?.profile_photo_url ? (
              <img 
                key={user.profile_photo_url} // Forces re-render when photo changes
                src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${user.profile_photo_url}`} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => { 
                  // If image fails to load (e.g. 404), fallback to the initial letter display
                  e.target.style.display = 'none'; 
                }} 
              />
            ) : null}
            {/* Show Initial letter if no photo OR if image above fails to load (display: none) */}
            <span className="text-xl font-bold text-cyan-600">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-gray-900 truncate text-sm">
              {displayName}
            </p>
            
            <div className="flex items-center space-x-1.5 group">
              <p className="text-[13px] font-bold text-cyan-600 font-mono uppercase tracking-tight">
                ID: MCARE-{user?.id || '001'}
              </p>
              <button 
                onClick={handleCopyId}
                className="p-1 hover:bg-cyan-50 rounded-md transition-colors border border-transparent hover:border-cyan-100"
                title="Copy ID"
              >
                {copied ? (
                  <Check size={14} className="text-green-600" />
                ) : (
                  <Copy size={14} className="text-gray-400 group-hover:text-cyan-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {currentMenu.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Skills Percentage – Candidate Only */}
      {user?.role === 'candidate' && (
        <div className="px-4 pb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <p className="text-[11px] font-bold text-gray-900">Skills Percentage:</p>
                <span className="text-[11px] font-bold text-cyan-600">{skillPercentage}%</span>
            </div>

            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                style={{ width: `${skillPercentage}%` }}
              />
            </div>

            <p className="text-[10px] text-gray-500 leading-relaxed text-left">
              Complete your profile to increase your score up to{' '}
              <span className="font-bold text-cyan-600">
                {targetPercentage}%
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;