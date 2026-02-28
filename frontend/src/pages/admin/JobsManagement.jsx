import React, { useMemo, useState, useEffect } from 'react';
import {
  Search,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Users,
  Briefcase,
  Download,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../api/adminService';

const JobsManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [notification, setNotification] = useState(null);

  const [jobsList, setJobsList] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await adminService.getJobs();
      setJobsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobsList([]);
    }
  };

  const [editFormData, setEditFormData] = useState({
    title: '',
    employer: '',
    location: '',
    type: 'Full-time',
    status: 'Active',
    salary: '',
    description: '',
    requirements: '',
  });

  const stats = useMemo(
    () => [
      {
        label: 'Total Jobs',
        value: jobsList.length.toString(),
        icon: Briefcase,
        color: 'text-teal-700',
        bg: 'bg-teal-50',
      },
      {
        label: 'Active Jobs',
        value: jobsList.filter((j) => j.status === 'Active').length.toString(),
        icon: Briefcase,
        color: 'text-green-600',
        bg: 'bg-green-50',
      },
      {
        label: 'Closed Jobs',
        value: jobsList.filter((j) => j.status === 'Closed').length.toString(),
        icon: Briefcase,
        color: 'text-gray-600',
        bg: 'bg-gray-50',
      },
      {
        label: 'Total Applications',
        value: jobsList.reduce((sum, job) => sum + job.applications, 0).toString(),
        icon: Users,
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
      },
    ],
    [jobsList]
  );

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  const handleEditJob = (job) => {
    setSelectedJob(job);
    setEditFormData({
      title: job.title,
      employer: job.employer,
      location: job.location,
      type: job.type,
      status: job.status,
      salary: job.salary,
      description: job.description,
      requirements: job.requirements,
    });
    setShowEditModal(true);
  };

  const handleDeleteJob = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateJob(selectedJob.id, editFormData);
      await fetchJobs(); // Refresh the list
      setShowEditModal(false);
      showNotification(`Job "${editFormData.title}" has been updated successfully!`);
    } catch (error) {
      console.error('Failed to update job:', error);
      showNotification(error.message || 'Failed to update job', 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await adminService.deleteJob(selectedJob.id, selectedJob.source);
      await fetchJobs(); // Refresh the list
      setShowDeleteModal(false);
      showNotification(`Job "${selectedJob.title}" has been deleted.`, 'info');
    } catch (error) {
      console.error('Failed to delete job:', error);
      showNotification(error.message || 'Failed to delete job', 'error');
    }
  };

  const filteredJobs = useMemo(() => {
    const byStatus =
      filterStatus === 'all'
        ? jobsList
        : jobsList.filter((job) => job.status.toLowerCase() === filterStatus);

    const q = searchTerm.trim().toLowerCase();
    if (!q) return byStatus;

    return byStatus.filter((job) => {
      const hay = `${job.title} ${job.employer} ${job.location} ${job.type} ${job.status}`.toLowerCase();
      return hay.includes(q);
    });
  }, [filterStatus, jobsList, searchTerm]);

  const downloadAllResumes = () => {
    if (!selectedJob?.applicants?.length) return;

    selectedJob.applicants.forEach((applicant) => {
      const link = document.createElement('a');
      link.href = applicant.resume;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    showNotification('All resumes downloaded successfully!');
  };

  return (
    <div>
      <Sidebar />

      {/* ✅ Desktop layout preserved (ml-64) + ✅ Mobile layout (ml-0) */}
      <div className="flex-1 md:ml-64 pt-16 md:pt-6 px-4 sm:px-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Manage all job postings on the platform
          </p>
        </div>

        {/* ✅ Stats: 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Filters + Search: stack on mobile, row on desktop */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'all'
                    ? 'bg-gradient-to-r from-teal-700 to-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Jobs
              </button>
              <button
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'active'
                    ? 'bg-gradient-to-r from-teal-700 to-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('closed')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterStatus === 'closed'
                    ? 'bg-gradient-to-r from-teal-700 to-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Closed
              </button>
            </div>

            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* ✅ Desktop table (unchanged look) */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Job Title</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Employer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Location</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Type</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Applications</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-semibold text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">{job.posted}</p>
                      {job.source === 'hr_post' && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">HR Posted</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{job.employer}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-900">{job.type}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                      {job.applications} applicants
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        job.status === 'Active'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewJob(job)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleEditJob(job)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Job"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Mobile/Tablet cards (no desktop disturbance) */}
        <div className="lg:hidden space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 leading-snug truncate">{job.title}</p>
                  <p className="text-sm text-gray-600">{job.employer}</p>
                  <p className="text-xs text-gray-500 mt-1">Posted {job.posted}</p>
                </div>

                <span
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>{job.applications} applicants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{job.salary}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleViewJob(job)}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEditJob(job)}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteJob(job)}
                  className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}

          {filteredJobs.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-600">
              No jobs found.
            </div>
          )}
        </div>
      </div>

      {/* View Job Modal */}
      {showViewModal && selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowViewModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 pt-5 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Job Details</h3>
                  <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{selectedJob.title}</h4>
                    <p className="text-gray-600">{selectedJob.employer}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-5 h-5" />
                      <span>{selectedJob.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Briefcase className="w-5 h-5" />
                      <span>{selectedJob.type}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <span>{selectedJob.salary}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>Posted {selectedJob.posted}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedJob.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {selectedJob.status}
                    </span>
                    <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                      {selectedJob.applications} Applications
                    </span>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                    <p className="text-gray-600">{selectedJob.description}</p>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Requirements</h5>
                    <p className="text-gray-600">{selectedJob.requirements}</p>
                  </div>
                </div>
              </div>

              {/* Applicants Section */}
              <div className="px-6 pb-4">
                <h5 className="font-semibold text-gray-900 mb-3">
                  Applicants ({selectedJob.applicants?.length || 0})
                </h5>

                {selectedJob.applicants && selectedJob.applicants.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedJob.applicants.map((applicant) => (
                      <div
                        key={applicant.id}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{applicant.name}</p>
                          <p className="text-sm text-gray-500">{applicant.email}</p>
                        </div>

                        <a
                          href={applicant.resume}
                          download
                          className="p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                          title="Download Resume"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No applicants yet.</p>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                {selectedJob.applicants?.length > 0 && (
                  <button
                    onClick={downloadAllResumes}
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700"
                  >
                    Download All Resumes
                  </button>
                )}

                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowEditModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmitEdit}>
                <div className="bg-white px-6 pt-5 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Edit Job</h3>
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <input
                        type="text"
                        name="title"
                        value={editFormData.title}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Employer</label>
                      <input
                        type="text"
                        name="employer"
                        value={editFormData.employer}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                      <select
                        name="type"
                        value={editFormData.type}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        name="status"
                        value={editFormData.status}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                      <input
                        type="text"
                        name="salary"
                        value={editFormData.salary}
                        onChange={handleFormChange}
                        required
                        placeholder="e.g., ₹5,00,000 - ₹7,00,000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={handleFormChange}
                        required
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                      <textarea
                        name="requirements"
                        value={editFormData.requirements}
                        onChange={handleFormChange}
                        required
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600"
                  >
                    Update Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowDeleteModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-5 pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Job Posting</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete <span className="font-semibold">{selectedJob.title}</span> at{' '}
                        {selectedJob.employer}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-teal-600'
            } text-white`}
          >
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4 hover:bg-white/20 rounded p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsManagement;