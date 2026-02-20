import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div className="flex flex-col">
                <span className="text-cyan-400 font-bold text-lg">MCARE</span>
                <span className="text-gray-400 text-xs">JOBS</span>
              </div>
            </div>
            <p className="text-sm">
              India's #1 Healthcare Job Platform connecting medical professionals with opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-cyan-400 transition">Home</Link></li>
              <li><Link to="/jobs" className="hover:text-cyan-400 transition">All Jobs</Link></li>
              <li><Link to="/about" className="hover:text-cyan-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Job Categories */}
          <div>
            <h3 className="text-white font-bold mb-4">Job Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition">Hospital Jobs - Doctors</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Hospital Management</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Medical Colleges</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Allied Health</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@mcarejobs.com</li>
              <li>Phone: +91-XXXX-XXXX-XX</li>
              <li className="pt-4">
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-cyan-400 transition">Facebook</a>
                  <a href="#" className="hover:text-cyan-400 transition">Twitter</a>
                  <a href="#" className="hover:text-cyan-400 transition">LinkedIn</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              &copy; 2025 MCARE Jobs. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
              <a href="#" className="hover:text-cyan-400 transition">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400 transition">Terms of Service</a>
              <a href="#" className="hover:text-cyan-400 transition">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
