import { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  Building2,
  TrendingUp,
  UserCheck,
  Clock
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

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/dashboard/stats"
        );

        const data = await response.json();

        setStats({
          totalUsers: data.totalUsers || 0,
          totalJobs: data.totalJobs || 0,
          employers: data.employers || 0,
          activeToday: data.activeToday || 0,
        });

        // Remove duplicates safely using Map
        const uniqueActivities = [
          ...new Map(
            data.recentActivity.map(item => [item.id, item])
          ).values()
        ];

        setRecentActivity(
          uniqueActivities.map((item) => ({
            id: item.id,
            user: item.name,
            action: `applied to ${item.title}`,
            time: new Date(item.applied_at).toLocaleString(),
            icon: Clock,
            color: 'cyan',
          }))
        );

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'cyan', link: '/admin/users' },
    { label: 'Active Jobs', value: stats.totalJobs, icon: Briefcase, color: 'blue', link: '/admin/jobs' },
    { label: 'Employers', value: stats.employers, icon: Building2, color: 'green', link: '/admin/employers' },
    { label: 'Active Today', value: stats.activeToday, icon: TrendingUp, color: 'purple', link: '/admin/analytics' },
  ];

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}! System overview and management
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
                {loading ? "..." : stat.value.toLocaleString()}
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
              <h3 className="text-2xl font-bold mb-2">
                System Administration
              </h3>
              <p className="text-cyan-100">
                Manage users, jobs, and platform settings
              </p>
            </div>

            <div className="flex space-x-4">
              <Link
                to="/admin/users"
                className="bg-white text-cyan-600 px-6 py-3 rounded-lg hover:bg-gray-100 font-medium"
              >
                Manage Users
              </Link>

              <Link
                to="/admin/reports"
                className="bg-cyan-700 text-white px-6 py-3 rounded-lg hover:bg-cyan-800 font-medium"
              >
                View Reports
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
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
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No recent activity found.
                </p>
              ) : (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className={`w-10 h-10 bg-${activity.color}-100 rounded-lg flex items-center justify-center`}>
                      <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
                    </div>

                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-semibold">
                          {activity.user}
                        </span> {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* System Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              System Statistics
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-cyan-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Total Candidates
                </span>
                <span className="text-xl font-bold text-cyan-600">
                  {stats.totalUsers}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Total HR Users
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {stats.employers}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Total Jobs
                </span>
                <span className="text-xl font-bold text-green-600">
                  {stats.totalJobs}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Applications Today
                </span>
                <span className="text-xl font-bold text-purple-600">
                  {stats.activeToday}
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
