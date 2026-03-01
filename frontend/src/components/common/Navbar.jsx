import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Briefcase,
  Info,
  Phone,
  LayoutDashboard,
  Users,
  Building2,
  BarChart3,
  Activity,
  Settings,
  User,
  FileText,
  File,
  Bell,
  Heart,
  MessageSquare,
  Lock,
  Trash2,
  Package,
  Calendar,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!userDropdownRef.current?.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Common links
  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/jobs', label: 'Find Jobs', icon: Briefcase },
    { to: '/about', label: 'About', icon: Info },
    { to: '/contact', label: 'Contact', icon: Phone },
  ];

  // Role-based links
  let roleLinks = [];
  let roleLabel = '';
  if (user && (user.role === 'admin' || user.role === 'administrator')) {
    roleLabel = 'Admin';
    roleLinks = [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/users', label: 'Users Management', icon: Users },
      { to: '/admin/jobs', label: 'Jobs Management', icon: Briefcase },
      { to: '/admin/applications', label: 'Applications', icon: FileText },
      { to: '/admin/employers', label: 'Employers', icon: Building2 },
      { to: '/admin/reports', label: 'Reports', icon: BarChart3 },
      { to: '/admin/activity', label: 'Activity Log', icon: Activity },
      { to: '/admin/settings', label: 'System Settings', icon: Settings },
    ];

  } else if (user && user.role === 'candidate') {
    roleLabel = 'Doctor';
    roleLinks = [
      { to: '/candidate/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
      { to: '/candidate/profile', label: 'Profile', icon: User },
      { to: '/candidate/applications', label: 'My Applied', icon: FileText },
      { to: '/candidate/resume', label: 'My Resume', icon: File },
      { to: '/candidate/alerts', label: 'Job Alerts', icon: Bell },
      { to: '/candidate/employers', label: 'Following Employers', icon: Building2 },
      { to: '/candidate/saved-jobs', label: 'Shortlisted Jobs', icon: Heart },
      { to: '/candidate/messages', label: 'Messages', icon: MessageSquare },
      { to: '/candidate/change-password', label: 'Change Password', icon: Lock },
      { to: '/candidate/delete-profile', label: 'Delete Profile', icon: Trash2 },
    ];
  } else if (user && user.role === 'hr') {
    roleLabel = 'Employer';
    roleLinks = [
      { to: '/hr/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/hr/settings', label: 'Profile', icon: User },
      { to: '/hr/jobs', label: 'My Jobs', icon: Briefcase },
      { to: '/hr/post-job', label: 'Submit Jobs', icon: Briefcase },
      { to: '/hr/applications', label: 'Applicant Jobs', icon: FileText },
      { to: '/hr/candidates', label: 'Shortlisted Candidates', icon: Users },
      { to: '/hr/candidate-alerts', label: 'Candidate Alerts', icon: Bell },
      { to: '/hr/packages', label: 'Packages', icon: Package },
      { to: '/hr/messages', label: 'Messages', icon: MessageSquare },
      { to: '/hr/interviews', label: 'Meetings Employer', icon: Calendar },
      { to: '/hr/change-password', label: 'Change Password', icon: Lock },
      { to: '/hr/delete-profile', label: 'Delete Profile', icon: Trash2 },
    ];
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-emerald-500 rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-105">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
              MCARE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive(link.to)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
            
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen((open) => !open)}
                  className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2 text-gray-700 hover:text-emerald-700 hover:bg-gray-50 transition"
                >
                  <span>{user?.name || user?.email}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      userDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-2 text-xs text-gray-400 uppercase border-b">
                      {roleLabel} Menu
                    </div>

                    {roleLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <link.icon className="w-4 h-4 mr-2" />
                        {link.label}
                      </Link>
                    ))}

                    <div className="border-t my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
            
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white font-medium rounded-lg hover:from-teal-800 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white font-medium rounded-lg hover:from-teal-800 hover:to-emerald-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                    isActive(link.to)
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-gray-50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
              {roleLinks.length > 0 && (
                <div className="flex flex-col space-y-1 border-t border-gray-100 pt-2">
                  <span className="px-4 py-2 text-xs text-gray-400 uppercase">{roleLabel} Menu</span>
                  {roleLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${isActive(link.to) ? 'bg-emerald-50 text-emerald-700' : ''}`}
                    >
                      <link.icon className="w-4 h-4 mr-2" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
              {/* Mobile Auth Buttons */}
              <div className="pt-4 space-y-2 border-t border-gray-200">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                    }}
                    className="block w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center bg-gradient-to-r from-teal-700 to-emerald-500 text-white font-medium rounded-lg hover:from-teal-800 hover:to-emerald-600 shadow-md"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-3 text-center bg-gradient-to-r from-teal-700 to-emerald-500 text-white font-medium rounded-lg hover:from-teal-800 hover:to-emerald-600 shadow-md"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;