import { useState, useEffect } from 'react';
import { Send, Clock, CheckCircle, XCircle, Eye, FileText, Building2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { applicationService } from '../../api/applicationService';

const Applications = () => {
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const data = await applicationService.getUserApplications();
        // Ensure data is an array
        const appsArray = Array.isArray(data) ? data : [];
        setApplications(appsArray);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const stats = {
    total: Array.isArray(applications) ? applications.length : 0,
    pending: Array.isArray(applications) ? applications.filter(a => a.status === 'Under Review').length : 0,
    shortlisted: Array.isArray(applications) ? applications.filter(a => a.status === 'Shortlisted').length : 0,
    interview: Array.isArray(applications) ? applications.filter(a => a.status === 'Interview').length : 0,
  };

  const filteredApplications =
    filter === 'all'
      ? (Array.isArray(applications) ? applications : [])
      : (Array.isArray(applications) ? applications.filter(a => (a.status || '').toLowerCase() === filter.toLowerCase()) : []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Under Review': return <Clock className="w-5 h-5" />;
      case 'Shortlisted': return <FileText className="w-5 h-5" />;
      case 'Interview': return <CheckCircle className="w-5 h-5" />;
      case 'Rejected': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Under Review': return 'bg-yellow-100 text-yellow-700';
      case 'Shortlisted': return 'bg-teal-100 text-teal-800';
      case 'Interview': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <Sidebar />

      {/* ✅ Responsive wrapper with mobile header spacing fix */}
      <div className="md:ml-64 min-h-screen bg-gray-50 p-4 pt-20 md:pt-6 md:p-6">

        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Track all your job applications in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard icon={<Send />} color="cyan" label="Total Applied" value={stats.total} />
          <StatCard icon={<Clock />} color="yellow" label="Under Review" value={stats.pending} />
          <StatCard icon={<FileText />} color="blue" label="Shortlisted" value={stats.shortlisted} />
          <StatCard icon={<CheckCircle />} color="green" label="Interviews" value={stats.interview} />
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex space-x-2 md:space-x-4 overflow-x-auto pb-2">
            {['all', 'under review', 'shortlisted', 'interview'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  filter === tab
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab === 'all' ? 'All Applications' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                {/* Left Section */}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{app.title}</h3>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-gray-600 text-sm">
                    <InfoItem icon={<Building2 />} text={app.company_name || app.company || '—'} />
                    <InfoItem icon={<MapPin />} text={app.location || '—'} />
                    <InfoItem icon={<Clock />} text={app.applied_at ? `Applied ${new Date(app.applied_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}` : ''} />
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(app.status)}`}>
                  {getStatusIcon(app.status)}
                  <span className="font-medium text-sm">{app.status}</span>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
                <span className="text-gray-900 font-semibold text-sm">
                  {app.job_type || ''}
                </span>
                <Link
                  to={`/candidate/application/${app.id}`}
                  className="flex items-center space-x-2 text-emerald-700 hover:text-emerald-700 font-medium text-sm"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <div className="bg-white rounded-xl p-8 md:p-12 text-center shadow-sm border border-gray-100">
            <FileText className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600 mb-6 text-sm md:text-base">Start applying to jobs to see them here</p>
            <Link
              to="/candidate/browse-jobs"
              className="inline-block bg-gradient-to-r from-teal-700 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-teal-800 hover:to-emerald-600 font-medium text-sm md:text-base"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

/* Reusable Components */

const StatCard = ({ icon, label, value, color }) => {
  const colors = {
    cyan: 'bg-emerald-100 text-emerald-700',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-teal-100 text-teal-700',
    green: 'bg-green-100 text-green-600',
  };

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );
};

const InfoItem = ({ icon, text }) => (
  <div className="flex items-center gap-1.5">
    <span className="w-4 h-4 flex-shrink-0 flex items-center justify-center">{icon}</span>
    <span>{text}</span>
  </div>
);

export default Applications;