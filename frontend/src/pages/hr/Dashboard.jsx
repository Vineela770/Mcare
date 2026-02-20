import { useState, useEffect } from 'react';
import { Users, Briefcase, FileText, TrendingUp, Clock, CheckCircle, Eye, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Sidebar from '../../components/common/Sidebar';

const HRDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviewed: 0,
    hired: 0,
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // ✅ Fetch Data From Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch("http://localhost:5000/api/dashboard/stats");
        const statsData = await statsRes.json();
        setStats(statsData);

        const appsRes = await fetch(
          "http://localhost:5000/api/dashboard/recent-applications"
        );
        const appsData = await appsRes.json();

        const formattedApps = appsData.map(app => ({
          id: app.id,
          candidateName: app.candidate_name,
          jobTitle: app.job_title,
          experience: app.experience,
          status: app.status,
          appliedDate: new Date(app.applied_date).toLocaleString(),
        }));

        setRecentApplications(formattedApps);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'cyan', link: '/hr/jobs' },
    { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'blue', link: '/hr/applications' },
    { label: 'Interviewed', value: stats.interviewed, icon: Users, color: 'green', link: '/hr/interviews' },
    { label: 'Hired', value: stats.hired, icon: CheckCircle, color: 'purple', link: '/hr/analytics' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-cyan-100 text-cyan-700';
      case 'Reviewed': return 'bg-blue-100 text-blue-700';
      case 'Interview': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      case 'Hired': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <Sidebar />

      <div className="ml-64 min-h-screen bg-gray-50 p-6">

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}! Manage your recruitment process
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 text-sm">
                {stat.label}
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Need to Hire Talent?</h3>
              <p className="text-cyan-100">
                Post a new job and start receiving applications
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/hr/post-job"
                className="bg-white text-cyan-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-medium"
              >
                Post New Job
              </Link>
              <Link
                to="/hr/applications"
                className="bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 font-medium"
              >
                Review Applications
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Applications
              </h2>
              <Link
                to="/hr/applications"
                className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-cyan-600">
                        {app.candidateName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {app.candidateName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {app.jobTitle} • {app.experience} experience
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{app.appliedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedApplication(app);
                        setShowDetails(true);
                      }}
                      className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* This Week Stats (Static UI Only) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">This Week</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-cyan-600" />
                  <span className="text-gray-700">New Applications</span>
                </div>
                <span className="text-xl font-bold text-cyan-600">
                  {stats.totalApplications}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white max-w-lg w-full rounded-xl shadow-xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Candidate Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              <div><b>Name:</b> {selectedApplication.candidateName}</div>
              <div><b>Applied For:</b> {selectedApplication.jobTitle}</div>
              <div><b>Experience:</b> {selectedApplication.experience}</div>
              <div><b>Status:</b> {selectedApplication.status}</div>
              <div><b>Applied:</b> {selectedApplication.appliedDate}</div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowDetails(false)}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
