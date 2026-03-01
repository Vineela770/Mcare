import React from "react";
import Sidebar from "../../components/common/Sidebar";

const Employers = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col items-center w-full">
        {/* Main Content */}
        <main className="w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-8 flex-1">
          {/* Page Title */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 text-center md:text-left">
            Following Employers
          </h1>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 sm:px-10 py-6 sm:py-8 w-full">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-10 gap-4 sm:gap-0">
              {/* Search */}
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Search ..."
                  className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute left-3 top-2 sm:top-3 text-gray-400">
                  🔍
                </span>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <span className="text-gray-700 font-medium text-sm sm:text-base">
                  Sort by:
                </span>
                <select className="w-full sm:w-auto px-3 sm:px-5 py-2 sm:py-3 border border-emerald-500 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm sm:text-base">
                  <option>Default</option>
                  <option selected>Newest</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            <div className="py-10 text-gray-500 text-sm sm:text-base text-center">
              No following employer found.
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-6 mt-6 sm:mt-10">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-sm">
            <p>© 2025 Mcare Jobs. All Rights Reserved.</p>
            <p>Privacy Policy, Terms & Conditions.</p>
            <p>Developed By – MerQ Digisol</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Employers;