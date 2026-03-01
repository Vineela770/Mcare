import React from "react";
import Sidebar from "../../components/common/Sidebar";

const CandidateAlerts = () => {
    return (
        <div className="flex min-h-screen bg-gray-50">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Right Content Area */}
        <div className="flex-1 ml-0 md:ml-64 flex flex-col pt-20 md:pt-0">
            
            {/* Main Content */}
            <main className="w-full max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8 flex-1">
            
            {/* Page Title */}
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                Candidate Alerts
            </h1>

            {/* Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 md:px-10 py-6 md:py-8">
                
                {/* Top Controls */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
                
                {/* Search */}
                <div className="relative w-full md:w-96">
                    <input
                    type="text"
                    placeholder="Search ..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="absolute left-4 top-3.5 text-gray-400">
                    🔍
                    </span>
                </div>

                {/* Sort */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto">
                    <span className="text-gray-700 font-medium">
                    Sort by:
                    </span>
                    <select className="w-full sm:w-auto px-5 py-3 border border-emerald-500 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Default</option>
                    <option defaultValue>Newest</option>
                    <option>Oldest</option>
                    </select>
                </div>
                </div>

                {/* Empty State */}
                <div className="py-10 text-gray-500 text-base text-center md:text-left">
                No candidate alert found.
                </div>

            </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-center py-6 px-4">
            <p className="text-sm">
                © 2025 Mcare Jobs. All Right Reserved.
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

export default CandidateAlerts;