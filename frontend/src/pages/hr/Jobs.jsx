import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Users, Eye, Edit2, Trash2, Clock } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import { employerService } from '../../api/employerService';
import Toast from '../../components/common/Toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await employerService.getJobs();
        const jobsArray = Array.isArray(data) ? data : [];
        setJobs(jobsArray);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job posting?')) return;
    setDeletingId(jobId);
    try {
      await employerService.deleteJob(jobId);
      setJobs(prev => prev.filter(j => j.id !== jobId));
      setToast({ message: 'Job deleted successfully.', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to delete job. Please try again.', type: 'error' });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job => filter === 'all' || job.status === filter) : [];

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      closed: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return styles[status] || styles.active;
  };

  return (
    <div className="flex">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Sidebar />

      {/* Main Content */}
      <div className="w-full min-h-screen bg-gray-50 p-4 sm:p-6 
                      mt-16 md:mt-0 
                      md:ml-64">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              My Jobs
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2">
              Manage all your job postings
            </p>
          </div>

          <Link
            to="/hr/post-job"
            className="bg-gradient-to-r from-teal-700 to-emerald-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-lg hover:from-teal-800 hover:to-emerald-600 font-medium text-center"
          >
            + Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Total Jobs</div>
            <div className="text-3xl font-bold text-gray-900">{jobs.length}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Active</div>
            <div className="text-3xl font-bold text-green-600">
              {jobs.filter(j => j.status === 'active').length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Closed</div>
            <div className="text-3xl font-bold text-red-600">
              {jobs.filter(j => j.status === 'closed').length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="text-sm text-gray-600 mb-1">Total Applicants</div>
            <div className="text-3xl font-bold text-emerald-700">
              {jobs.reduce((sum, job) => sum + (Number(job.applicants) || 0), 0)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {['all', 'active', 'closed', 'draft'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-gradient-to-r from-teal-700 to-emerald-500 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {job.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{job.department}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{Number(job.applicants) || 0} Applicants</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Deadline: {job.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowJobDetails(true);
                    }}
                    className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  <button className="p-2 text-teal-700 hover:bg-teal-50 rounded-lg">
                    <Edit2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handleDelete(job.id)}
                    disabled={deletingId === job.id}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-40"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600">Start by posting a new job</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;