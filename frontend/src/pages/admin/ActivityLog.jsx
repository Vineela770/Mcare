import React, { useMemo, useState } from 'react';
import { UserCheck, UserX, Briefcase, FileText, Clock, Search, Menu, X } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const ActivityLog = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Mobile sidebar drawer
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const activities = [
    {
      id: 1,
      type: 'user',
      action: 'New user registered',
      user: 'Rajesh Kumar',
      details: 'Candidate account created',
      timestamp: '2 minutes ago',
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      id: 2,
      type: 'job',
      action: 'New job posted',
      user: 'MCARE Hospital',
      details: 'Senior Nurse - ICU position',
      timestamp: '15 minutes ago',
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 3,
      type: 'application',
      action: 'Application submitted',
      user: 'Priya Sharma',
      details: 'Applied for Medical Officer position',
      timestamp: '32 minutes ago',
      icon: FileText,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
    {
      id: 4,
      type: 'user',
      action: 'Account deleted',
      user: 'Test User',
      details: 'User account permanently deleted',
      timestamp: '1 hour ago',
      icon: UserX,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      id: 5,
      type: 'job',
      action: 'Job closed',
      user: 'Apollo Hospitals',
      details: 'Lab Technician position closed',
      timestamp: '2 hours ago',
      icon: Clock,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
    },
    {
      id: 6,
      type: 'user',
      action: 'Profile updated',
      user: 'Amit Patel',
      details: 'Updated professional information',
      timestamp: '3 hours ago',
      icon: UserCheck,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      id: 7,
      type: 'application',
      action: 'Application withdrawn',
      user: 'Sneha Reddy',
      details: 'Withdrew application for Physiotherapist role',
      timestamp: '4 hours ago',
      icon: FileText,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
    {
      id: 8,
      type: 'job',
      action: 'Job updated',
      user: 'City Hospital',
      details: 'Modified Medical Officer job requirements',
      timestamp: '5 hours ago',
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      id: 9,
      type: 'user',
      action: 'Password changed',
      user: 'Ramesh Kumar',
      details: 'User changed account password',
      timestamp: '6 hours ago',
      icon: UserCheck,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      id: 10,
      type: 'application',
      action: 'Application status updated',
      user: 'HR Department',
      details: 'Shortlisted 5 candidates for interview',
      timestamp: '7 hours ago',
      icon: FileText,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
    },
  ];

  const stats = [
    { label: 'Total Activities', value: '1,234', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Today', value: '87', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'This Week', value: '342', icon: Clock, color: 'text-cyan-600', bg: 'bg-cyan-50' },
    { label: 'This Month', value: '1,156', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const filteredActivities = useMemo(() => {
    const base = filterType === 'all' ? activities : activities.filter((a) => a.type === filterType);
    const q = searchTerm.trim().toLowerCase();
    if (!q) return base;

    return base.filter((a) => {
      const hay = `${a.action} ${a.user} ${a.details} ${a.type}`.toLowerCase();
      return hay.includes(q);
    });
  }, [filterType, searchTerm]);

return (
  <div className="flex min-h-screen bg-gray-50">
  <Sidebar />

  {/* ✅ Main Content */}
  <div className="flex-1 md:ml-64 pt-16 md:pt-6 px-4 sm:px-6">

    {/* ✅ Heading */}
    <div className="mb-6 md:mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        Activity Log
      </h1>
      <p className="text-gray-600 mt-1 text-sm md:text-base">
        Monitor all platform activities and events
      </p>
    </div>

      {/* ✅ Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Filters & Search */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex flex-wrap items-center gap-3">
            {['all', 'user', 'job', 'application'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === type
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'all'
                  ? 'All Activities'
                  : type === 'user'
                  ? 'User Activities'
                  : type === 'job'
                  ? 'Job Activities'
                  : 'Applications'}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* ✅ Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 sm:gap-4 pb-4 border-b border-gray-100 last:border-0"
            >
              <div className={`${activity.bg} p-3 rounded-lg flex-shrink-0`}>
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{activity.user}</span> • {activity.details}
                    </p>
                  </div>

                  <span className="text-xs sm:text-sm text-gray-500 sm:ml-4 flex-shrink-0">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Load More */}
      <div className="mt-6 text-center">
        <button className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
          Load More Activities
        </button>
      </div>

    </div>
  </div>
);
};

export default ActivityLog;