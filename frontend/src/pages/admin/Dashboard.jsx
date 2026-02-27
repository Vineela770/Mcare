import { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  UserCheck,
  UserX,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import Sidebar from '../../components/common/Sidebar';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    employers: 0,
    activeToday: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      setStats({
        totalUsers: 2458,
        totalJobs: 342,
        employers: 156,
        activeToday: 892,
      });
    };
    fetchStats();
  }, []);

  // ✅ Fixed color classes (Tailwind does not support dynamic strings)
  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      bg: 'bg-cyan-100',
      text: 'text-cyan-600',
      link: '/admin/users',
    },
    {
      label: 'Active Jobs',
      value: stats.totalJobs,
      icon: Briefcase,
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      link: '/admin/jobs',
    },
    {
      label: 'Employers',
      value: stats.employers,
      icon: Building2,
      bg: 'bg-green-100',
      text: 'text-green-600',
      link: '/admin/employers',
    },
    {
      label: 'Active Today',
      value: stats.activeToday,
      icon: TrendingUp,
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      link: '/admin/analytics',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      user: 'John Doe',
      action: 'registered as Candidate',
      time: '5 min ago',
      icon: UserCheck,
      bg: 'bg-green-100',
      text: 'text-green-600',
    },
    {
      id: 2,
      user: 'Manhattan Hospital',
      action: 'posted a new job',
      time: '15 min ago',
      icon: Briefcase,
      bg: 'bg-blue-100',
      text: 'text-blue-600',
    },
    {
      id: 3,
      user: 'Sarah Johnson',
      action: 'applied to Senior Nurse position',
      time: '1 hour ago',
      icon: Clock,
      bg: 'bg-cyan-100',
      text: 'text-cyan-600',
    },
    {
      id: 4,
      user: 'Old Account',
      action: 'was deactivated',
      time: '2 hours ago',
      icon: UserX,
      bg: 'bg-red-100',
      text: 'text-red-600',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* ✅ Main Content (Mobile Responsive Fix Applied) */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-6 px-4 sm:px-6">
        {/* Welcome Section */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Welcome back, {user?.name}! System overview and management
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.text}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-5 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-white mb-4 md:mb-0">
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                System Administration
              </h3>
              <p className="text-cyan-100 text-sm md:text-base">
                Manage users, jobs, and platform settings
              </p>
            </div>

            {/* ✅ Buttons Stack on Mobile */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/admin/users"
                className="bg-white text-cyan-600 px-5 py-2.5 rounded-lg hover:bg-gray-100 font-medium text-center"
              >
                Manage Users
              </Link>
              <Link
                to="/admin/reports"
                className="bg-cyan-700 text-white px-5 py-2.5 rounded-lg hover:bg-cyan-800 font-medium text-center"
              >
                View Reports
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                Recent Activity
              </h2>
              <Link
                to="/admin/activity"
                className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div
                    className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center`}
                  >
                    <activity.icon className={`w-5 h-5 ${activity.text}`} />
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm md:text-base">
                      <span className="font-semibold">
                        {activity.user}
                      </span>{' '}
                      {activity.action}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Statistics */}
          <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">
              System Statistics
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-cyan-50 rounded-lg">
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  Total Candidates
                </span>
                <span className="text-lg md:text-xl font-bold text-cyan-600">
                  1,847
                </span>
              </div>

              <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  Total HR Users
                </span>
                <span className="text-lg md:text-xl font-bold text-blue-600">
                  156
                </span>
              </div>

              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  Total Employees
                </span>
                <span className="text-lg md:text-xl font-bold text-green-600">
                  455
                </span>
              </div>

              <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium text-sm md:text-base">
                  Applications Today
                </span>
                <span className="text-lg md:text-xl font-bold text-purple-600">
                  67
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;