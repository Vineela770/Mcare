import React, { useMemo, useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Mail,
  Star,
  MapPin,
  Briefcase,
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // ✅ Fetch from backend
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/applications");
        const data = await res.json();

        const formatted = data.map(app => ({
          id: app.id,
          candidateName: app.candidate_name,
          candidateAvatar: app.candidate_name?.substring(0, 2).toUpperCase(),
          jobTitle: app.job_title,
          experience: app.experience,
          qualification: app.qualification,
          location: app.location,
          appliedDate: new Date(app.created_at).toLocaleDateString(),
          status: app.status,
          rating: app.rating,
          email: app.email,
          phone: app.phone,
          summary: app.summary,
          skills: app.skills ? app.skills.split(",") : []
        }));

        setApplications(formatted);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);

  const normalizeStatus = (s) =>
    String(s).toLowerCase().trim().replace(/\s+/g, '-');

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const statusMatch =
        filterStatus === 'all' ||
        normalizeStatus(app.status) === filterStatus;

      const searchMatch =
        !searchTerm ||
        app.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());

      return statusMatch && searchMatch;
    });
  }, [applications, filterStatus, searchTerm]);

  const getStatusBadge = (status) => {
    const config = {
      Pending: 'bg-yellow-50 text-yellow-600',
      Shortlisted: 'bg-green-50 text-green-600',
      Rejected: 'bg-red-50 text-red-600',
      'Interview Scheduled': 'bg-blue-50 text-blue-600'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config[status] || config.Pending}`}>
        {status}
      </span>
    );
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">
            Review and manage candidate applications
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Filters</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex space-x-2">
            {['all', 'pending', 'shortlisted', 'interview-scheduled', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-4 px-6 text-left">Candidate</th>
                <th className="py-4 px-6 text-left">Job Position</th>
                <th className="py-4 px-6 text-left">Qualification</th>
                <th className="py-4 px-6 text-left">Experience</th>
                <th className="py-4 px-6 text-left">Rating</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredApplications.map(app => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {app.candidateAvatar}
                      </div>
                      <div>
                        <p className="font-semibold">{app.candidateName}</p>
                        <p className="text-sm text-gray-500">{app.location}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6">{app.jobTitle}</td>
                  <td className="py-4 px-6">{app.qualification}</td>
                  <td className="py-4 px-6">{app.experience}</td>
                  <td className="py-4 px-6 flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {app.rating}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(app.status)}</td>

                  <td className="py-4 px-6 space-x-2">
                    <button
                      onClick={() => setSelectedApplication(app) || setShowDetailsModal(true)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {app.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(app.id, "Shortlisted")}
                          className="p-2 hover:bg-green-50 rounded-lg"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>

                        <button
                          onClick={() => updateStatus(app.id, "Rejected")}
                          className="p-2 hover:bg-red-50 rounded-lg"
                        >
                          <XCircle className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View Modal */}
        {showDetailsModal && selectedApplication && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Application Details"
          >
            <div className="space-y-3">
              <p><strong>Name:</strong> {selectedApplication.candidateName}</p>
              <p><strong>Email:</strong> {selectedApplication.email}</p>
              <p><strong>Phone:</strong> {selectedApplication.phone}</p>
              <p><strong>Summary:</strong> {selectedApplication.summary}</p>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Applications;
