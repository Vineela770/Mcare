import React, { useState, useEffect } from 'react';
import { Download, FileText, Users, Briefcase, IndianRupee, X, CheckCircle, BarChart2, Loader2, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../api/adminService';

const Reports = () => {
  const [notification, setNotification] = useState(null);
  const [dateRange, setDateRange] = useState({ from: '2025-12-09', to: '2026-03-02' });
  const [stats, setStats] = useState({ totalReports: 0, thisMonth: 0, totalDownloads: 0, scheduled: 0 });
  const [scheduledReports, setScheduledReports] = useState([]);
  const [downloading, setDownloading] = useState(null);
  const [generating, setGenerating] = useState(null);
  const [generatedReport, setGeneratedReport] = useState(null);

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
    showNotification(`Filter applied: ${dateRange.from} to ${dateRange.to}`);
  };

  // ── CSV Download ────────────────────────────────────────────────────────────
  const handleGenerateReport = async (reportTitle) => {
    if (generating) return;
    setGenerating(reportTitle);
    try {
      let summary = {};
      if (reportTitle.includes('User')) {
        const data = await adminService.getUsers();
        summary = {
          title: 'User Analytics Report', total: data.length,
          items: [
            { label: 'Candidates / Doctors', count: data.filter(u => u.role === 'candidate').length, color: 'bg-emerald-100 text-emerald-800' },
            { label: 'HR / Employers',       count: data.filter(u => u.role === 'hr').length,        color: 'bg-teal-100 text-teal-800' },
            { label: 'Admins',               count: data.filter(u => u.role === 'admin').length,     color: 'bg-gray-100 text-gray-700' },
            { label: 'Active Accounts',      count: data.filter(u => u.status === 'Active').length,  color: 'bg-green-100 text-green-800' },
            { label: 'Inactive Accounts',    count: data.filter(u => u.status !== 'Active').length,  color: 'bg-red-100 text-red-700' },
          ],
        };
      } else if (reportTitle.includes('Job')) {
        const data = await adminService.getJobs();
        summary = {
          title: 'Job Postings Report', total: data.length,
          items: [
            { label: 'Active',           count: data.filter(j => j.is_active === true || j.status === 'active').length, color: 'bg-emerald-100 text-emerald-800' },
            { label: 'Inactive/Expired', count: data.filter(j => !j.is_active && j.status !== 'active').length,          color: 'bg-red-100 text-red-700' },
          ],
        };
      } else if (reportTitle.includes('Employer')) {
        const data = await adminService.getEmployers();
        summary = {
          title: 'Employer Activity Report', total: data.length,
          items: [
            { label: 'Active Employers',  count: data.filter(e => e.status === 'Active').length,           color: 'bg-green-100 text-green-800' },
            { label: 'Inactive',          count: data.filter(e => e.status !== 'Active').length,           color: 'bg-red-100 text-red-700' },
            { label: 'Total Active Jobs', count: data.reduce((s, e) => s + (e.activeJobs || 0), 0),        color: 'bg-teal-100 text-teal-800' },
          ],
        };
      } else if (reportTitle.includes('Candidate')) {
        const data = await adminService.getUsers();
        const c = data.filter(u => u.role === 'candidate');
        summary = {
          title: 'Candidate Activity Report', total: c.length,
          items: [
            { label: 'Active',   count: c.filter(u => u.status === 'Active').length,  color: 'bg-emerald-100 text-emerald-800' },
            { label: 'Inactive', count: c.filter(u => u.status !== 'Active').length,  color: 'bg-red-100 text-red-700' },
          ],
        };
      } else {
        const data = await adminService.getAllApplications();
        const statuses = {};
        data.forEach(a => { const s = a.status || 'Unknown'; statuses[s] = (statuses[s] || 0) + 1; });
        summary = {
          title: 'Applications Report', total: data.length,
          items: Object.entries(statuses).map(([status, count]) => ({
            label: status, count,
            color: status === 'Shortlisted' ? 'bg-emerald-100 text-emerald-800' : status === 'Rejected' ? 'bg-red-100 text-red-700' : status === 'Interview' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700',
          })),
        };
      }
      setGeneratedReport(summary);
    } catch (e) {
      console.error(e);
      showNotification('Generate failed: ' + (e?.message || 'error'), 'error');
    } finally {
      setGenerating(null);
    }
  };

  const handleDownloadReport = async (reportTitle) => {
    if (downloading) return;
    setDownloading(reportTitle);
    try {
      let headers = [], rows = [], filename = '';
      if (reportTitle.includes('User')) {
        const data = await adminService.getUsers();
        headers = ['Name','Email','Role','Status','Joined'];
        rows = data.map(u => [u.name,u.email,u.role,u.status,u.joined?new Date(u.joined).toLocaleDateString('en-IN'):'']);
        filename = 'users_report.csv';
      } else if (reportTitle.includes('Job')) {
        const data = await adminService.getJobs();
        headers = ['Title','Company','Location','Status','Created'];
        rows = data.map(j => [j.title,j.company_name||j.employer_name||'',j.location||'',j.status||(j.is_active?'Active':'Inactive'),j.created_at?new Date(j.created_at).toLocaleDateString('en-IN'):'' ]);
        filename = 'jobs_report.csv';
      } else if (reportTitle.includes('Employer')) {
        const data = await adminService.getEmployers();
        headers = ['Organization','Email','Location','Status','Active Jobs'];
        rows = data.map(e => [e.name,e.email,e.location||'',e.status,e.activeJobs||0]);
        filename = 'employers_report.csv';
      } else if (reportTitle.includes('Candidate')) {
        const data = await adminService.getUsers();
        const candidates = data.filter(u => u.role === 'candidate');
        headers = ['Name','Email','Qualification','Location','Status','Joined'];
        rows = candidates.map(u => [u.name,u.email,u.qualification||'',u.location||'',u.status,u.joined?new Date(u.joined).toLocaleDateString('en-IN'):'' ]);
        filename = 'candidates_report.csv';
      } else {
        const data = await adminService.getAllApplications();
        headers = ['Candidate','Email','Job','Employer','Applied On','Status'];
        rows = data.map(a => [a.candidate_name||'',a.candidate_email||'',a.job_title||'',a.employer_name||'',a.applied_at?new Date(a.applied_at).toLocaleDateString('en-IN'):'',a.status||'']);
        filename = 'applications_report.csv';
      }
      const esc = v => '"'+String(v??'').replace(/"/g,'""')+'"';
      const csv = [headers.map(esc).join(','),...rows.map(r=>r.map(esc).join(','))].join('\n');
      const blob = new Blob([csv],{type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = filename;
      document.body.appendChild(link); link.click();
      document.body.removeChild(link); URL.revokeObjectURL(url);
      showNotification(reportTitle+' downloaded — '+rows.length+' records');
    } catch (e) {
      console.error(e);
      showNotification('Download failed: '+(e?.message||'error'),'error');
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadAll = () => { reportTypes.forEach(r => handleDownloadReport(r.title)); };

  const reportTypes = [
    {
      title: 'User Analytics Report',
      description: 'Detailed analysis of user registrations, activity, and demographics',
      icon: Users,
      color: 'text-teal-700',
      bg: 'bg-teal-50',
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
    { label: 'Total Reports', value: stats.totalReports.toString(), color: 'text-teal-700' },
    { label: 'This Month', value: stats.thisMonth.toString(), color: 'text-green-600' },
    { label: 'Total Downloads', value: stats.totalDownloads.toString(), color: 'text-emerald-700' },
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <input
                  type="date"
                  name="to"
                  value={dateRange.to}
                  onChange={handleDateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleApplyFilter}
                  className="w-full sm:w-auto px-8 py-3 text-base font-semibold bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600 transition-all shadow-sm"
                >
                  Apply Filter
                </button>
              </div>
            </div>

            <button
              onClick={handleDownloadAll}
              className="w-full md:w-auto px-6 py-2 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download All</span>
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report, index) => {
            const isDownloading = downloading === report.title;
            const isGenerating  = generating  === report.title;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${report.bg} p-3 rounded-lg`}>
                    <report.icon className={`w-6 h-6 ${report.color}`} />
                  </div>
                  <button
                    onClick={() => handleDownloadReport(report.title)}
                    disabled={!!downloading}
                    title="Download as CSV"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 group"
                  >
                    {isDownloading
                      ? <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                      : <Download className="w-5 h-5 text-gray-600 group-hover:text-emerald-700" />}
                  </button>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">{report.title}</h3>
                <p className="text-sm text-gray-500 mb-5">{report.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-600 font-medium">
                    {isDownloading && 'Preparing CSV…'}
                    {isGenerating  && 'Fetching data…'}
                  </span>
                  <button
                    onClick={() => handleGenerateReport(report.title)}
                    disabled={!!generating}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50 text-sm"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />}
                    Generate
                  </button>
                </div>
              </div>
            );
          })}
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
                    <div className="bg-teal-100 p-2 rounded-lg">
                      <FileText className="w-5 h-5 text-teal-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{report.title || report.name}</p>
                      <p className="text-sm text-gray-600">{report.schedule || report.description}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${report.status === 'active' ? 'text-emerald-700' : 'text-gray-500'}`}>
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

      {/* Generated Report Modal */}
      {generatedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-gray-700/60" onClick={() => setGeneratedReport(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-700 to-emerald-500 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{generatedReport.title}</h3>
                <p className="text-emerald-100 text-xs mt-0.5">Generated {new Date().toLocaleDateString('en-IN')}</p>
              </div>
              <button onClick={() => setGeneratedReport(null)} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5 border-b pb-4">
                <span className="text-sm text-gray-500 font-medium">Total Records</span>
                <span className="text-3xl font-bold text-gray-900">{generatedReport.total}</span>
              </div>
              <div className="space-y-3">
                {generatedReport.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-sm text-gray-700">{item.label}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  onClick={() => { setGeneratedReport(null); handleDownloadReport(generatedReport.title); }}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-sm font-medium hover:bg-emerald-800 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download CSV
                </button>
                <button onClick={() => setGeneratedReport(null)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {notification && (
        <div className="fixed top-4 right-4 left-4 md:left-auto z-50">
          <div className={`flex items-center justify-between px-5 py-4 rounded-lg shadow-lg text-white ${
            notification.type === 'error' ? 'bg-red-600' : notification.type === 'info' ? 'bg-teal-700' : 'bg-emerald-700'
          }`}>
            <div className="flex items-center gap-3">
              {notification.type === 'error'
                ? <AlertCircle className="w-5 h-5 flex-shrink-0" />
                : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              <span className="font-medium text-sm md:text-base">{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="ml-4"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;