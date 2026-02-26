import { useState, useEffect } from 'react';
import { Send, Clock, CheckCircle, XCircle, Eye, FileText, Building2, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import { useAuth } from '../../context/useAuth';

const Applications = () => {
  const { token } = useAuth();
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * 📅 Helper: Formats "2 days ago" style dates
   */
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "Today";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays >= 7 && diffDays < 30) return `${Math.floor(diffDays/7)} week ago`;
    return past.toLocaleDateString();
  };

  useEffect(() => {
    /**
     * 🚀 Fetch live application history from MCARE Backend
     */
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${API_BASE}/api/candidate/my-applications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          // Mapping backend fields to match your structure
          const formattedApps = data.applications.map(app => ({
            id: app.id,
            title: app.title,
            company: app.company_name,
            location: app.location || 'India',
            appliedDate: app.applied_at, // Keep raw date for helper
            status: app.status || 'Under Review',
            // 🛠️ Pulled from the new database column
            salary: app.salary || 'Competitive' 
          }));
          setApplications(formattedApps);
        }
      } catch (error) {
        console.error("❌ Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchApplications();
    }
  }, [token]);

  // Derived Stats based on live data from database
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'Under Review').length,
    shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
    interview: applications.filter(a => a.status === 'Interview').length,
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(a => a.status.toLowerCase() === filter.toLowerCase());

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
      case 'Shortlisted': return 'bg-blue-100 text-blue-700';
      case 'Interview': return 'bg-green-100 text-green-700';
      case 'Rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track all your job applications in one place</p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center text-cyan-600 font-bold">Σ</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</div>
          <div className="text-gray-600 text-sm">Total Applied</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 font-bold">⌚</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.pending}</div>
          <div className="text-gray-600 text-sm">Under Review</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold">📄</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.shortlisted}</div>
          <div className="text-gray-600 text-sm">Shortlisted</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold">✓</div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.interview}</div>
          <div className="text-gray-600 text-sm">Interviews</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex space-x-4">
          {['all', 'under review', 'shortlisted', 'interview'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filter === tab 
                  ? 'bg-cyan-100 text-cyan-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab === 'all' ? 'All Applications' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Retrieving application history...</div>
        ) : filteredApplications.map((app) => (
          <div key={app.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{app.title}</h3>
                    <div className="flex items-center space-x-4 text-gray-600 text-sm">
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>{app.company}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-cyan-500" />
                        <span>{app.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        {/* 🛠️ Improved date formatting */}
                        <span>Applied {getTimeAgo(app.appliedDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    <span className="font-medium">{app.status}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  {/* 🛠️ Dynamic salary from database */}
                  <span className="text-gray-900 font-bold">{app.salary}</span>
                  <Link
                    to={`/candidate/application/${app.id}`}
                    className="flex items-center space-x-2 text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredApplications.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
          <p className="text-gray-600 mb-6">Start applying to jobs to track your progress here</p>
          <Link
            to="/candidate/browse-jobs"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium"
          >
            Browse Available Jobs
          </Link>
        </div>
      )}
      </div>
    </div>
  );
};

export default Applications;