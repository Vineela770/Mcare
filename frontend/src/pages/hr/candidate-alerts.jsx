import React, { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";

const CandidateAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Newest");

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/candidate-alerts");
      const data = await res.json();
      setAlerts(data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  const filteredAlerts = alerts
    .filter(alert =>
      alert.candidate_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "Newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        return new Date(a.created_at) - new Date(b.created_at);
      }
    });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col items-center">
        <main className="w-full max-w-6xl px-6 py-8 flex-1">

          <h1 className="text-3xl font-semibold text-gray-900 mb-6">
            Candidate Alerts
          </h1>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-10 py-8">

            {/* Top Controls */}
            <div className="flex items-center justify-between mb-10">

              {/* Search */}
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder="Search ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="px-5 py-3 border border-sky-400 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>

            {/* Alerts List */}
            {filteredAlerts.length === 0 ? (
              <div className="py-10 text-gray-500 text-base">
                No candidate alert found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAlerts.map(alert => (
                  <div
                    key={alert.id}
                    className="border border-gray-200 rounded-lg p-5 bg-gray-50"
                  >
                    <div className="font-semibold text-gray-900">
                      {alert.candidate_name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {alert.specialization}
                    </div>
                    <div className="text-gray-700 mt-2">
                      {alert.message}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(alert.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-sky-500 text-white text-center py-6">
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
