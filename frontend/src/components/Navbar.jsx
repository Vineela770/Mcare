import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, Briefcase, Calendar, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get navigation links based on user role
  const getRoleLinks = () => {
    if (!isAuthenticated || !user) return [];

    switch (user.role) {
      case 'candidate':
        return [
          { to: '/candidate/dashboard', icon: <User size={18} />, label: 'Dashboard' },
          { to: '/candidate/browse-jobs', icon: <Briefcase size={18} />, label: 'Browse Jobs' },
          { to: '/candidate/applications', icon: <Calendar size={18} />, label: 'My Applications' },
          { to: '/candidate/resume', icon: <User size={18} />, label: 'Resume' },
          { to: '/candidate/profile', icon: <User size={18} />, label: 'Profile' },
        ];
      case 'hr':
        return [
          { to: '/hr/dashboard', icon: <Briefcase size={18} />, label: 'Dashboard' },
          { to: '/hr/jobs', icon: <Briefcase size={18} />, label: 'Manage Jobs' },
          { to: '/hr/jobs/create', icon: <Briefcase size={18} />, label: 'Post Job' },
          { to: '/hr/applications', icon: <Calendar size={18} />, label: 'Applications' },
        ];
      case 'employee':
        return [
          { to: '/employee/dashboard', icon: <Calendar size={18} />, label: 'Dashboard' },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: <Shield size={18} />, label: 'Dashboard' },
          { to: '/admin/users', icon: <User size={18} />, label: 'Manage Users' },
        ];
      default:
        return [];
    }
  };

  const roleLinks = getRoleLinks();

  // Get role badge
  const getRoleBadge = () => {
    if (!user?.role) return null;
    
    const badges = {
      candidate: { color: 'bg-blue-100 text-blue-700', label: 'Candidate' },
      hr: { color: 'bg-green-100 text-green-700', label: 'HR' },
      employee: { color: 'bg-purple-100 text-purple-700', label: 'Employee' },
      admin: { color: 'bg-red-100 text-red-700', label: 'Admin' },
    };

    const badge = badges[user.role];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-cyan-600 font-bold text-lg">MCARE</span>
              <span className="text-gray-500 text-xs">Healthcare Jobs</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {roleLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center gap-2 text-gray-700 hover:text-cyan-600 font-medium transition"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                


              </>
            ) : (
              <>
                <Link to="/" className="text-gray-700 hover:text-cyan-600 font-medium">
                  Home
                </Link>
                <Link to="/jobs" className="text-gray-700 hover:text-cyan-600 font-medium">
                  Jobs
                </Link>
                <Link to="/about" className="text-gray-700 hover:text-cyan-600 font-medium">
                  About
                </Link>
                <Link to="/contact" className="text-gray-700 hover:text-cyan-600 font-medium">
                  Contact
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 text-cyan-600 border border-cyan-600 rounded-lg hover:bg-cyan-50 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {isAuthenticated ? (
              <>
                <div className="flex flex-col gap-2 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    {getRoleBadge()}
                    <span className="text-gray-700 font-medium">{user?.fullName || user?.email}</span>
                  </div>
                </div>
                {roleLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-2 text-gray-700 hover:text-cyan-600"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700 mt-4 w-full"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="block py-2 text-gray-700 hover:text-cyan-600">
                  Home
                </Link>
                <Link to="/jobs" className="block py-2 text-gray-700 hover:text-cyan-600">
                  Jobs
                </Link>
                <Link to="/about" className="block py-2 text-gray-700 hover:text-cyan-600">
                  About
                </Link>
                <Link to="/contact" className="block py-2 text-gray-700 hover:text-cyan-600">
                  Contact
                </Link>
                <Link to="/login" className="block py-2 text-cyan-600 font-semibold">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg mt-2 text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
        
      </div>
    </nav>
  );
};

export default Navbar;