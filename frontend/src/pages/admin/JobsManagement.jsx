import React, { useState, useEffect } from 'react';
import {
  Search, Edit2, Trash2, Eye,
  MapPin, Users, Briefcase,
  Download, X, CheckCircle,
  AlertCircle, Calendar
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const JobsManagement = () => {

  const [filterStatus, setFilterStatus] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [notification, setNotification] = useState(null);
  const [jobsList, setJobsList] = useState([]);

  const [editFormData, setEditFormData] = useState({
    title: '',
    employer: '',
    location: '',
    type: 'Full-time',
    status: 'Active',
    salary: '',
    description: '',
    requirements: ''
  });

  // ================= FETCH JOBS =================
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobs");
      const data = await res.json();
      setJobsList(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= NOTIFICATION =================
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ================= VIEW JOB =================
  const handleViewJob = async (job) => {
    const res = await fetch(`http://localhost:5000/api/jobs/${job.id}`);
    const data = await res.json();
    setSelectedJob(data);
    setShowViewModal(true);
  };

  // ================= EDIT =================
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
      requirements: job.requirements
    });
    setShowEditModal(true);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    await fetch(`http://localhost:5000/api/jobs/${selectedJob.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editFormData)
    });

    fetchJobs();
    setShowEditModal(false);
    showNotification("Job updated successfully!");
  };

  // ================= DELETE =================
  const handleDeleteJob = (job) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    await fetch(`http://localhost:5000/api/jobs/${selectedJob.id}`, {
      method: "DELETE"
    });

    fetchJobs();
    setShowDeleteModal(false);
    showNotification("Job deleted successfully!", "info");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // ================= FILTER =================
  const filteredJobs =
    filterStatus === 'all'
      ? jobsList
      : jobsList.filter(job =>
          job.status.toLowerCase() === filterStatus
        );

  // ================= STATS =================
  const stats = [
    {
      label: 'Total Jobs',
      value: jobsList.length,
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      label: 'Active Jobs',
      value: jobsList.filter(j => j.status === 'Active').length,
      icon: Briefcase,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      label: 'Closed Jobs',
      value: jobsList.filter(j => j.status === 'Closed').length,
      icon: Briefcase,
      color: 'text-gray-600',
      bg: 'bg-gray-50'
    },
    {
      label: 'Total Applications',
      value: jobsList.reduce(
        (sum, job) => sum + (parseInt(job.applications_count) || 0),
        0
      ),
      icon: Users,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50'
    }
  ];

  // ================= DOWNLOAD ALL =================
  const downloadAllResumes = () => {
    if (!selectedJob?.applicants?.length) return;

    selectedJob.applicants.forEach(applicant => {
      const link = document.createElement('a');
      link.href = applicant.resume_url;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    showNotification("All resumes downloaded successfully!");
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Jobs Management</h1>
          <p className="text-gray-600 mt-1">Manage all job postings on the platform</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border">
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left">Job Title</th>
                <th className="px-6 py-4 text-left">Employer</th>
                <th className="px-6 py-4 text-left">Location</th>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Applications</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id} className="border-t">
                  <td className="px-6 py-4">{job.title}</td>
                  <td className="px-6 py-4">{job.employer}</td>
                  <td className="px-6 py-4">{job.location}</td>
                  <td className="px-6 py-4">{job.type}</td>
                  <td className="px-6 py-4">{job.applications_count}</td>
                  <td className="px-6 py-4">{job.status}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button onClick={() => handleViewJob(job)}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEditJob(job)}>
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteJob(job)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* NOTIFICATION */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg">
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default JobsManagement;
