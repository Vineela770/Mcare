import React from "react";
import Sidebar from "../../components/common/Sidebar";

const Employers = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Content Area */}
      <div className="flex-1 ml-64 flex flex-col items-center">
        {/* Main Content */}
        <main className="w-full max-w-6xl px-6 py-8 flex-1">
          {/* Page Title */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Following Employers
          </h1>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-10 py-8">
            {/* Top Controls */}
            <div className="flex items-center justify-between mb-10">
              {/* Search */}
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder="Search ..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
                <span className="absolute left-4 top-3.5 text-gray-400">
                  🔍
                </span>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-3">
                <span className="text-gray-700 font-medium">
                  Sort by:
                </span>
                <select className="px-5 py-3 border border-sky-400 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-400">
                  <option>Default</option>
                  <option selected>Newest</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            <div className="py-10 text-gray-500 text-base">
              No following employer found.
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-sky-500 text-white text-center py-6">
          <p className="text-sm">
            ©️ 2025 Mcare Jobs. All Right Reserved.
          </p>
          <p className="text-sm mt-1">
            Privacy policy, Terms & Conditions.
          </p>
          <p className="text-sm mt-2">
            Developed By – MerQ Digisol
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Employers;