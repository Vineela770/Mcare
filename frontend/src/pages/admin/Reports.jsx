import React, { useState, useEffect } from 'react';
import { Download, FileText, Users, Briefcase, IndianRupee, X, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const Reports = () => {

  const [notification, setNotification] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
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
      const res = await fetch("http://localhost:5000/api/reports/stats");
      const data = await res.json();

      setStats({
        totalReports: Number(data.totalReports) || 0,
        thisMonth: Number(data.thisMonth) || 0,
        totalDownloads: Number(data.totalDownloads) || 0,
        scheduled: Number(data.scheduled) || 0
      });

      setScheduledReports(data.scheduledReports || []);

    } catch (error) {
      console.error("Error fetching report stats:", error);
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

  const handleGenerateReport = async (reportTitle) => {
    try {
      showNotification(`Generating ${reportTitle}...`);

      const response = await fetch("http://localhost:5000/api/reports/generate-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dateRange)
      });

      if (!response.ok) {
        throw new Error("Report generation failed");
      }

      showNotification(`${reportTitle} generated successfully!`);
      fetchReportStats();

    } catch (error) {
      console.error(error);
      showNotification("Failed to generate report", "error");
    }
  };

  const handleDownloadReport = async (reportTitle) => {
    showNotification(`Downloading ${reportTitle}...`);
  };

  const handleDownloadAll = () => {
    showNotification('Preparing all reports for download...');
  };

  const quickStats = [
    { label: 'Total Reports', value: stats.totalReports, color: 'text-blue-600' },
    { label: 'This Month', value: stats.thisMonth, color: 'text-green-600' },
    { label: 'Total Downloads', value: stats.totalDownloads, color: 'text-cyan-600' },
    { label: 'Scheduled', value: stats.scheduled, color: 'text-purple-600' }
  ];

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and download platform reports</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Date Range Selector */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  name="from"
                  value={dateRange.from}
                  onChange={handleDateChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  name="to"
                  value={dateRange.to}
                  onChange={handleDateChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-6">
                <button
                  onClick={handleApplyFilter}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow"
                >
                  Apply Filter
                </button>
              </div>
            </div>

            <button
              onClick={handleDownloadAll}
              className="px-6 py-2 border border-cyan-500 text-cyan-600 rounded-lg hover:bg-cyan-50 transition-colors flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download All</span>
            </button>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Scheduled Reports
          </h2>

          {scheduledReports.length === 0 ? (
            <p className="text-gray-500 text-sm">No scheduled reports found.</p>
          ) : (
            scheduledReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-3">
                <div>
                  <p className="font-medium text-gray-900">{report.title}</p>
                  <p className="text-sm text-gray-600">{report.schedule_info}</p>
                </div>
                <span className="text-sm text-cyan-600 font-medium">
                  {report.status}
                </span>
              </div>
            ))
          )}
        </div>

      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <div className="flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg bg-green-500 text-white">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 hover:bg-white/20 rounded p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reports;
