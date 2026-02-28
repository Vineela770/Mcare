import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  X,
  Menu,
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const skillPercentage = 13;
  const targetPercentage = 87;

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
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
      { icon: FileText, label: 'Applications', path: '/admin/applications' },
      { icon: Building2, label: 'Employers', path: '/admin/employers' },
      { icon: FileText, label: 'Reports', path: '/admin/reports' },
      { icon: List, label: 'Activity Log', path: '/admin/activity' },
      { icon: Settings, label: 'System Settings', path: '/admin/settings' },
    ],
  };

  // Normalize role: backend returns 'administrator', but we use 'admin' for menu
  const userRole = user?.role === 'administrator' ? 'admin' : user?.role;
  const currentMenu = menuItems[userRole] || [];

  const getProfilePath = () =>
    user?.role === 'candidate'
      ? '/candidate/profile'
      : user?.role === 'hr'
      ? '/hr/settings'
      : '/admin/settings';

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
  }, [mobileOpen]);

  const SidebarContent = ({ isMobile = false }) => (
    <div className="w-full h-full bg-white flex flex-col overflow-y-auto">

      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link
          to="/"
          onClick={() => isMobile && setMobileOpen(false)}
          className="flex items-center space-x-2 mb-4"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">MCARE</span>
        </Link>

        <div
          onClick={() => {
            navigate(getProfilePath());
            if (isMobile) setMobileOpen(false);
          }}
          className="flex items-center space-x-3 mt-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-emerald-700">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>

          <div>
            <p className="font-semibold text-gray-900">{user?.name || 'User'}</p>
            <p className="text-sm text-gray-500">User ID: {user?.id || 'MC-1001'}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {currentMenu.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={index}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-teal-700 to-emerald-500 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Skills */}
      {user?.role === 'candidate' && (
        <div className="px-4 pb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              Skills Percentage: <span className="text-red-500">{skillPercentage}%</span>
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${skillPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500">
              Improve your profile to reach{" "}
              <span className="font-semibold text-emerald-700">
                {targetPercentage}%
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-red-600 hover:bg-red-50 transition-colors border border-red-200 bg-white"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white border border-gray-200 shadow-sm rounded-lg p-2"
      >
        <Menu className="w-6 h-6 text-gray-800" />
      </button>

      {/* Desktop */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">

          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />

          {/* ✅ Scrollable Drawer */}
          <div className="absolute left-0 top-0 h-screen w-[85%] max-w-[320px] bg-white shadow-2xl overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
              <p className="font-semibold text-gray-900">Menu</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-800" />
              </button>
            </div>

            {/* Sidebar Content */}
            <SidebarContent isMobile />

          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;