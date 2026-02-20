import React, { useState, useEffect } from 'react';
import { UserCheck, Briefcase, FileText, Clock } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const ActivityLog = () => {
  const [filterType, setFilterType] = useState('all');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 REAL DATABASE CONNECTION
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/activities");
        
        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }

        const data = await response.json();
        setActivities(data);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Unable to load activities.");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "user":
        return UserCheck;
      case "job":
        return Briefcase;
      case "application":
        return FileText;
      default:
        return Clock;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "user":
        return { color: "text-green-600", bg: "bg-green-50" };
      case "job":
        return { color: "text-blue-600", bg: "bg-blue-50" };
      case "application":
        return { color: "text-cyan-600", bg: "bg-cyan-50" };
      default:
        return { color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const filteredActivities =
    filterType === "all"
      ? activities
      : activities.filter(activity => activity.type === filterType);

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-600 mt-1">
            Monitor all platform activities and events
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center space-x-4">
            {["all", "user", "job", "application"].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === type
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === "all" ? "All Activities" :
                 type === "user" ? "User Activities" :
                 type === "job" ? "Job Activities" :
                 "Applications"}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

          {loading && (
            <p className="text-gray-500 text-center">Loading activities...</p>
          )}

          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}

          {!loading && !error && filteredActivities.length === 0 && (
            <p className="text-gray-500 text-center">No activities found.</p>
          )}

          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const Icon = getIcon(activity.type);
              const style = getColor(activity.type);

              return (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0"
                >
                  <div className={`${style.bg} p-3 rounded-lg flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${style.color}`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-medium">
                            {activity.username}
                          </span>{" "}
                          • {activity.details}
                        </p>
                      </div>

                      <span className="text-sm text-gray-500">
                        {activity.created_at
                          ? new Date(activity.created_at).toLocaleString()
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
