import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Eye,
  Download,
  X,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  Building2,
  User,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../api/adminService';

const STATUS_COLORS = {
  pending:       'bg-yellow-100 text-yellow-700',
  applied:       'bg-teal-100  text-teal-800',
  'under review':'bg-orange-100 text-orange-700',
  shortlisted:   'bg-emerald-100  text-emerald-700',
  interview:     'bg-purple-100 text-purple-700',
  offered:       'bg-green-100 text-green-700',
  hired:         'bg-emerald-100 text-emerald-700',
  rejected:      'bg-red-100  text-red-700',
  withdrawn:     'bg-gray-100  text-gray-600',
};

const STATUS_ICONS = {
  shortlisted: CheckCircle,
  interview:   Calendar,
  offered:     CheckCircle,
  hired:       CheckCircle,
  rejected:    XCircle,
  pending:     Clock,
  applied:     Clock,
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

const StatusPill = ({ status }) => {
  const key = (status || '').toLowerCase();
  const cls = STATUS_COLORS[key] || 'bg-gray-100 text-gray-600';
  const Icon = STATUS_ICONS[key] || Clock;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      <Icon className="w-3 h-3" />
      {status || 'Unknown'}
    </span>
  );
};

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewApp, setViewApp] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [appsData, statsData] = await Promise.all([
          adminService.getAllApplications(),
          adminService.getApplicationStats(),
        ]);
        setApplications(Array.isArray(appsData) ? appsData : []);
        setStats(statsData || { total: 0, byStatus: [] });
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const allStatuses = ['all', ...Array.from(new Set(applications.map(a => a.status).filter(Boolean)))];

  const filtered = applications.filter(app => {
    const matchStatus = statusFilter === 'all' || (app.status || '').toLowerCase() === statusFilter.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (app.candidate_name || '').toLowerCase().includes(q) ||
      (app.candidate_email || '').toLowerCase().includes(q) ||
      (app.job_title || '').toLowerCase().includes(q) ||
      (app.employer_name || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const BACKEND = import.meta.env.VITE_API_URL || 'https://mcare-backend-61sy.onrender.com';

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-0 md:ml-64 min-h-screen bg-gray-50 p-4 sm:p-6 pt-16 sm:pt-6 md:pt-6">

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Applications Management</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            All job applications submitted by doctors / candidates
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total || applications.length}</p>
          </div>
          {(stats.byStatus || []).slice(0, 3).map((s) => (
            <div key={s.status} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 mb-1 capitalize">{s.status}</p>
              <p className="text-2xl font-bold text-emerald-700">{s.count}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by candidate, job or employer…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {allStatuses.map(s => (
                <option key={s} value={s} className="capitalize">
                  {s === 'all' ? 'All Statuses' : s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Desktop Table */}
        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm">
            Loading applications…
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {['Candidate', 'Job Title', 'Employer', 'Applied On', 'Status', 'Resume', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                        No applications found.
                      </td>
                    </tr>
                  ) : filtered.map(app => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-700 to-emerald-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {(app.candidate_name || '?').charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{app.candidate_name || '—'}</p>
                            <p className="text-xs text-gray-500">{app.candidate_email || ''}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{app.job_title || '—'}</p>
                        <p className="text-xs text-gray-500">{app.job_location || ''}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{app.employer_name || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{formatDate(app.applied_at)}</td>
                      <td className="px-4 py-3"><StatusPill status={app.status} /></td>
                      <td className="px-4 py-3">
                        {app.resume_url ? (
                          <a
                            href={`${BACKEND}${app.resume_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-800"
                          >
                            <Download className="w-3 h-3" /> Resume
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setViewApp(app)}
                          className="text-emerald-600 hover:text-emerald-800"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filtered.length === 0 ? (
                <div className="bg-white rounded-xl p-6 text-center text-gray-400">
                  No applications found.
                </div>
              ) : filtered.map(app => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-700 to-emerald-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(app.candidate_name || '?').charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{app.candidate_name}</p>
                        <p className="text-xs text-gray-500 break-all">{app.candidate_email}</p>
                      </div>
                    </div>
                    <button onClick={() => setViewApp(app)} className="text-emerald-600 flex-shrink-0">
                      <Eye className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-400">Job</span>
                      <p className="font-medium text-gray-800 truncate">{app.job_title}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-400">Employer</span>
                      <p className="font-medium text-gray-800 truncate">{app.employer_name || '—'}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <span className="text-gray-400">Applied</span>
                      <p className="font-medium text-gray-800">{formatDate(app.applied_at)}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2 flex flex-col justify-center">
                      <StatusPill status={app.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Count */}
            <p className="mt-3 text-xs text-gray-500">
              Showing {filtered.length} of {applications.length} applications
            </p>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {viewApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-6">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-60" onClick={() => setViewApp(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 overflow-hidden">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-teal-700 to-emerald-500 px-6 py-4 flex items-center justify-between">
                <div className="text-white">
                  <h3 className="text-lg font-bold">Application Detail</h3>
                  <p className="text-emerald-100 text-xs mt-0.5">Application #{viewApp.id}</p>
                </div>
                <button onClick={() => setViewApp(null)} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                {/* Status */}
                <div className="flex items-center justify-between">
                  <StatusPill status={viewApp.status} />
                  <span className="text-xs text-gray-500">Applied: {formatDate(viewApp.applied_at)}</span>
                </div>

                {/* Candidate */}
                <div className="bg-emerald-50 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-emerald-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Candidate / Doctor
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-medium">{viewApp.candidate_name || '—'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      {viewApp.candidate_email}
                    </div>
                    {viewApp.candidate_phone && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Phone className="w-3.5 h-3.5" /> {viewApp.candidate_phone}
                      </div>
                    )}
                    {viewApp.qualification && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <GraduationCap className="w-3.5 h-3.5" /> {viewApp.qualification}
                      </div>
                    )}
                  </div>
                  {viewApp.resume_url && (
                    <a
                      href={`${BACKEND}${viewApp.resume_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 text-white rounded-lg text-xs hover:bg-teal-700"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Resume
                    </a>
                  )}
                </div>

                {/* Job */}
                <div className="bg-teal-50 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-teal-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Job Details
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="font-medium text-gray-900">{viewApp.job_title || '—'}</p>
                    {viewApp.job_location && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <MapPin className="w-3.5 h-3.5" /> {viewApp.job_location}
                      </div>
                    )}
                    {viewApp.job_type && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-3.5 h-3.5" /> {viewApp.job_type}
                      </div>
                    )}
                  </div>
                </div>

                {/* Employer */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Employer / Hospital
                  </h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="font-medium text-gray-900">{viewApp.employer_name || '—'}</p>
                    {viewApp.employer_contact && (
                      <p className="text-gray-500">Contact: {viewApp.employer_contact}</p>
                    )}
                    {viewApp.employer_email && (
                      <p className="text-gray-500">{viewApp.employer_email}</p>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                {viewApp.cover_letter_url && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> Cover Letter
                    </h4>
                    <a
                      href={`${BACKEND}${viewApp.cover_letter_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-800"
                    >
                      <Download className="w-3.5 h-3.5" /> View Cover Letter
                    </a>
                  </div>
                )}
              </div>

              <div className="px-6 py-4 border-t flex justify-end">
                <button
                  onClick={() => setViewApp(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
