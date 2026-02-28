import { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Briefcase,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  Eye,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Sidebar from '../../components/common/Sidebar';
import { employerService } from '../../api/employerService';

const HRDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    interviewed: 0,
    hired: 0,
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState({
    newApplications: 0,
    shortlisted: 0,
    interviews: 0,
    rejected: 0,
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard stats
        const statsData = await employerService.getDashboardStats();
        setStats({
          activeJobs: statsData.activeJobs || 0,
          totalApplications: statsData.totalApplications || 0,
          interviewed: statsData.interviewed || 0,
          hired: statsData.hired || 0,
        });

        // Fetch recent applications
        const applicationsData = await employerService.getRecentApplications();
        const appsArray = Array.isArray(applicationsData) ? applicationsData : [];
        setRecentApplications(appsArray.slice(0, 3));

        // Fetch weekly stats
        try {
          const weekData = await employerService.getWeeklyStats();
          setWeeklyStats({
            newApplications: weekData.newApplications || 0,
            shortlisted: weekData.shortlisted || 0,
            interviews: weekData.interviews || 0,
            rejected: weekData.rejected || 0,
          });
        } catch {
          // fallback silently – weekly stats non-critical
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setRecentApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = useMemo(
    () => [
      { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'cyan', link: '/hr/jobs' },
      { label: 'Total Applications', value: stats.totalApplications, icon: FileText, color: 'blue', link: '/hr/applications' },
      { label: 'Interviewed', value: stats.interviewed, icon: Users, color: 'green', link: '/hr/interviews' },
      { label: 'Hired', value: stats.hired, icon: CheckCircle, color: 'purple', link: '/hr/analytics' },
    ],
    [stats]
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-cyan-100 text-cyan-700';
      case 'Reviewed':
        return 'bg-blue-100 text-blue-700';
      case 'Interview':
        return 'bg-green-100 text-green-700';
      case 'Rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // ✅ Tailwind-safe color mapping (prevents bg-${} from failing in production)
  const statStyles = {
    cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  };

  return (
    <div>
      <Sidebar />

      {/* ✅ Desktop preserved: md:ml-64 (same as your ml-64 for desktop) */}
      {/* ✅ Mobile: ml-0 + extra top padding so header sits slightly down */}
      <div className="ml-0 md:ml-64 min-h-screen bg-gray-50 p-4 md:p-6 pt-16 md:pt-6">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Welcome back, {user?.name}! Manage your recruitment process
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {statCards.map((stat, index) => {
            const style = statStyles[stat.color] || statStyles.cyan;
            return (
              <Link
                key={index}
                to={stat.link}
                className="bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${style.bg} rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${style.text}`} />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>

                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-5 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-white">
              <h3 className="text-xl md:text-2xl font-bold mb-2">Need to Hire Talent?</h3>
              <p className="text-cyan-100 text-sm md:text-base">Post a new job and start receiving applications</p>
            </div>

            {/* ✅ Mobile buttons stack, desktop stays row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
              <Link
                to="/hr/post-job"
                className="w-full sm:w-auto text-center bg-white text-cyan-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-medium"
              >
                Post New Job
              </Link>
              <Link
                to="/hr/applications"
                className="w-full sm:w-auto text-center bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 font-medium"
              >
                Review Applications
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Applications */}
          <div className="lg:col-span-2 bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Applications</h2>
              <Link to="/hr/applications" className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">
                View All →
              </Link>
            </div>

            <div className="space-y-3 md:space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors"
                >
                  <div className="flex items-start sm:items-center space-x-4 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-cyan-600">{app.candidateName.charAt(0)}</span>
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{app.candidateName}</h3>
                      <p className="text-sm text-gray-600 truncate">
                        {app.jobTitle} • {app.experience} experience
                      </p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <Clock className="w-4 h-4 shrink-0" />
                        <span className="truncate">{app.appliedDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end sm:gap-3 gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>

                    <button
                      onClick={() => {
                        setSelectedApplication(app);
                        setShowDetails(true);
                      }}
                      className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-5 md:mb-6">This Week</h2>

            <div className="space-y-3 md:space-y-4">
              <Link to="/hr/applications" className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-cyan-600" />
                  <span className="text-gray-700 text-sm md:text-base">New Applications</span>
                </div>
                <span className="text-xl font-bold text-cyan-600">{weeklyStats.newApplications}</span>
              </Link>

              <Link to="/hr/applications" className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 text-sm md:text-base">Shortlisted</span>
                </div>
                <span className="text-xl font-bold text-blue-600">{weeklyStats.shortlisted}</span>
              </Link>

              <Link to="/hr/interviews" className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700 text-sm md:text-base">Interviews</span>
                </div>
                <span className="text-xl font-bold text-green-600">{weeklyStats.interviews}</span>
              </Link>

              <Link to="/hr/applications" className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <XCircle className="w-5 h-5 text-red-600" />
                  <span className="text-gray-700 text-sm md:text-base">Rejected</span>
                </div>
                <span className="text-xl font-bold text-red-600">{weeklyStats.rejected}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && selectedApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white max-w-lg w-full rounded-xl shadow-xl p-5 md:p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Candidate Details</h2>
              <button onClick={() => setShowDetails(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <span className="text-gray-600">✕</span>
              </button>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-900">Name:</span> {selectedApplication.candidateName}
              </div>

              <div>
                <span className="font-medium text-gray-900">Applied For:</span> {selectedApplication.jobTitle}
              </div>

              <div>
                <span className="font-medium text-gray-900">Experience:</span> {selectedApplication.experience}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-900">Application Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.status)}`}>
                  {selectedApplication.status}
                </span>
              </div>

              <div>
                <span className="font-medium text-gray-900">Applied:</span> {selectedApplication.appliedDate}
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowDetails(false)}
                className="w-full sm:w-auto px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
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