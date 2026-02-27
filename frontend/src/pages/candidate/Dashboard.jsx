import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Eye,
  TrendingUp,
  Clock,
  MapPin,
  Building2,
  Send,
} from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Sidebar from '../../components/common/Sidebar';
import { userService } from '../../api/userService';
import { applicationService } from '../../api/applicationService';

const CandidateDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    applied: 0,
    shortlisted: 0,
    interviews: 0,
    profileViews: 0,
  });

  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard stats from backend
        const statsData = await userService.getDashboardStats();
        setStats({
          applied: statsData.applications || 0,
          shortlisted: statsData.shortlisted || 0,
          interviews: statsData.interviews || 0,
          profileViews: statsData.profileViews || 0,
        });

        // Fetch recent applications
        const applicationsData = await applicationService.getUserApplications();
        // Ensure applicationsData is an array before using .slice()
        const appsArray = Array.isArray(applicationsData) ? applicationsData : [];
        setRecentApplications(appsArray.slice(0, 3)); // Show only 3 recent
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Keep default empty state
        setRecentApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statStyles = {
    cyan: 'bg-cyan-100 text-cyan-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  const statCards = [
    { label: 'Jobs Applied', value: stats.applied, icon: Send, color: 'cyan', link: '/candidate/applications' },
    { label: 'Shortlisted', value: stats.shortlisted, icon: FileText, color: 'blue', link: '/candidate/applications' },
    { label: 'Interviews', value: stats.interviews, icon: TrendingUp, color: 'green', link: '/candidate/applications' },
    { label: 'Profile Views', value: stats.profileViews, icon: Eye, color: 'purple', link: '/candidate/profile' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review': return 'bg-yellow-100 text-yellow-700';
      case 'Shortlisted': return 'bg-blue-100 text-blue-700';
      case 'Interview': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <Sidebar />

      {/* ✅ FIXED CONTENT WRAPPER */}
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 md:ml-64">
        {/* ✅ MOBILE HEADER SPACING FIX (push down under hamburger) */}
        <div className="pt-14 md:pt-0">
          {/* Welcome */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              Track your job applications and manage your healthcare career
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={index}
                  to={stat.link}
                  className="bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${statStyles[stat.color]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </Link>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-5 md:p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="text-white mb-4 md:mb-0">
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  Ready to Find Your Next Role?
                </h3>
                <p className="text-cyan-100 text-sm md:text-base">
                  Browse thousands of healthcare jobs matched to your skills
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/candidate/browse-jobs"
                  className="bg-white text-cyan-600 px-6 py-3 rounded-lg font-medium text-center"
                >
                  Browse Jobs
                </Link>
                <Link
                  to="/candidate/resume"
                  className="bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium text-center"
                >
                  Update Resume
                </Link>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Applications */}
            <div className="lg:col-span-2 bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  Recent Applications
                </h2>
                <Link to="/candidate/applications" className="text-cyan-600 text-sm font-medium">
                  View All →
                </Link>
              </div>

              <div className="space-y-4">
                {recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:border-cyan-300 transition"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center text-2xl">
                        {app.logo}
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                          {app.title}
                        </h3>

                        <div className="flex flex-wrap gap-3 text-xs md:text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span>{app.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{app.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{app.appliedDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className={`mt-3 sm:mt-0 px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <Link
                  to="/candidate/browse-jobs"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm md:text-base">
                      Browse Jobs
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">
                      Find new opportunities
                    </div>
                  </div>
                </Link>

                <Link
                  to="/candidate/resume"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm md:text-base">
                      My Resume
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">
                      Update your profile
                    </div>
                  </div>
                </Link>

                <Link
                  to="/candidate/saved-jobs"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 text-sm md:text-base">
                      Saved Jobs
                    </div>
                    <div className="text-xs md:text-sm text-gray-500">
                      View bookmarked jobs
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;