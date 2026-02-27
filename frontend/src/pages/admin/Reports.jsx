import React, { useState, useEffect } from 'react';
import { Download, FileText, Users, Briefcase, IndianRupee, X, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../api/adminService';

const Reports = () => {
  const [notification, setNotification] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: '2025-12-09',
    to: '2026-01-09'
  });
  const [stats, setStats] = useState({
    totalReports: 0,
    thisMonth: 0,
    totalDownloads: 0,
    scheduled: 0
  });
  const [scheduledReports, setScheduledReports] = useState([]);

  useEffect(() => {
    fetchReportStats();
  }, []);

  const fetchReportStats = async () => {
    try {
      const data = await adminService.getReportStats();
      setStats({
        totalReports: data.totalReports || 0,
        thisMonth: data.thisMonth || 0,
        totalDownloads: data.totalDownloads || 0,
        scheduled: data.scheduled || 0
      });
      
      // Fetch scheduled reports if available
      if (data.scheduledReports && Array.isArray(data.scheduledReports)) {
        setScheduledReports(data.scheduledReports);
      }
    } catch (error) {
      console.error('Failed to fetch report stats:', error);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    showNotification(`Filter applied for ${dateRange.from} to ${dateRange.to}`);
  };

  const handleGenerateReport = (reportTitle) => {
    showNotification(`Generating ${reportTitle}...`);
    setTimeout(() => {
      showNotification(`${reportTitle} generated successfully!`);
    }, 1500);
  };

  const handleDownloadReport = (reportTitle) => {
    showNotification(`Downloading ${reportTitle}...`);
  };

  const handleDownloadAll = () => {
    showNotification('Preparing all reports for download...');
    setTimeout(() => {
      showNotification('All reports downloaded successfully!');
    }, 2000);
  };

  const reportTypes = [
    {
      title: 'User Analytics Report',
      description: 'Detailed analysis of user registrations, activity, and demographics',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Job Postings Report',
      description: 'Complete overview of job postings, applications, and success rates',
      icon: Briefcase,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'Revenue Report',
      description: 'Financial summary including subscriptions and transaction details',
      icon: IndianRupee,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
    },
    {
      title: 'Employer Activity Report',
      description: 'Detailed breakdown of employer engagement and hiring statistics',
      icon: Briefcase,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Candidate Activity Report',
      description: 'Analysis of candidate behavior, applications, and success rates',
      icon: Users,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    }
  ];

  const quickStats = [
    { label: 'Total Reports', value: stats.totalReports.toString(), color: 'text-blue-600' },
    { label: 'This Month', value: stats.thisMonth.toString(), color: 'text-green-600' },
    { label: 'Total Downloads', value: stats.totalDownloads.toString(), color: 'text-cyan-600' },
    { label: 'Scheduled', value: stats.scheduled.toString(), color: 'text-purple-600' }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-6 p-4 md:p-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Generate and download platform reports
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
              <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Date Range */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <input
                  type="date"
                  name="from"
                  value={dateRange.from}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  name="to"
                  value={dateRange.to}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleApplyFilter}
                  className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
                >
                  Apply Filter
                </button>
              </div>
            </div>

            <button
              onClick={handleDownloadAll}
              className="w-full md:w-auto px-6 py-2 border border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download All</span>
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`${report.bg} p-3 rounded-lg`}>
                  <report.icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <button
                  onClick={() => handleDownloadReport(report.title)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{report.description}</p>

              <div className="flex items-center justify-end">
                <button
                  onClick={() => handleGenerateReport(report.title)}
                  className="text-cyan-600 font-medium hover:text-cyan-700"
                >
                  Generate →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Scheduled Reports */}
        <div className="mt-6 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
            Scheduled Reports
          </h2>

          <div className="space-y-3">
            {scheduledReports.length > 0 ? (
              scheduledReports.map((report, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{report.title || report.name}</p>
                      <p className="text-sm text-gray-600">{report.schedule || report.description}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${report.status === 'active' ? 'text-cyan-600' : 'text-gray-500'}`}>
                    {report.status || 'Inactive'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No scheduled reports available</p>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {notification && (
        <div className="fixed top-4 right-4 left-4 md:left-auto z-50">
          <div className={`flex items-center justify-between px-6 py-4 rounded-lg shadow-lg text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;