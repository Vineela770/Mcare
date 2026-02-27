import React, { useState } from 'react';
import { Download, FileText, Users, Briefcase, IndianRupee, X, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const Reports = () => {
  const [notification, setNotification] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: '2025-12-09',
    to: '2026-01-09'
  });

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
      period: 'Last 30 days',
      size: '2.4 MB'
    },
    {
      title: 'Job Postings Report',
      description: 'Complete overview of job postings, applications, and success rates',
      icon: Briefcase,
      color: 'text-green-600',
      bg: 'bg-green-50',
      period: 'Last 30 days',
      size: '1.8 MB'
    },
    {
      title: 'Revenue Report',
      description: 'Financial summary including subscriptions and transaction details',
      icon: IndianRupee,
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      period: 'Last 30 days',
      size: '1.2 MB'
    },
    {
      title: 'Employer Activity Report',
      description: 'Detailed breakdown of employer engagement and hiring statistics',
      icon: Briefcase,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      period: 'Last 30 days',
      size: '2.0 MB'
    },
    {
      title: 'Candidate Activity Report',
      description: 'Analysis of candidate behavior, applications, and success rates',
      icon: Users,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
      period: 'Last 30 days',
      size: '2.7 MB'
    }
  ];

  const quickStats = [
    { label: 'Total Reports', value: '48', change: '+12%', color: 'text-blue-600' },
    { label: 'This Month', value: '8', change: '+3', color: 'text-green-600' },
    { label: 'Total Downloads', value: '156', change: '+28%', color: 'text-cyan-600' },
    { label: 'Scheduled', value: '4', change: '0', color: 'text-purple-600' }
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
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <span className={`text-xs font-medium ${stat.color}`}>{stat.change}</span>
              </div>
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

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-500">
                    <FileText className="w-4 h-4 inline mr-1" />
                    {report.size}
                  </span>
                  <span className="text-gray-500">{report.period}</span>
                </div>
                <button
                  onClick={() => handleGenerateReport(report.title)}
                  className="text-cyan-600 font-medium"
                >
                  Generate
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg gap-3">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Monthly User Report</p>
                  <p className="text-sm text-gray-600">Scheduled for 1st of every month</p>
                </div>
              </div>
              <span className="text-sm text-cyan-600 font-medium">Active</span>
            </div>
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