import React, { useMemo, useState } from 'react';
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
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedJob, setSelectedJob] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showShortlistModal, setShowShortlistModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const [applications, setApplications] = useState([
    {
      id: 1,
      candidateName: 'Rajesh Kumar',
      candidateAvatar: 'RK',
      jobTitle: 'Senior Nurse - ICU',
      experience: '5 years',
      qualification: 'B.Sc Nursing',
      location: 'Guntur, AP',
      appliedDate: '2 days ago',
      status: 'Pending',
      rating: 4.5,
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      summary:
        'Experienced ICU nurse with expertise in critical care and patient monitoring. Proven track record of managing complex cases.',
      skills: ['Critical Care', 'Patient Monitoring', 'Emergency Response', 'Documentation'],
    },
    {
      id: 2,
      candidateName: 'Priya Sharma',
      candidateAvatar: 'PS',
      jobTitle: 'Medical Officer',
      experience: '8 years',
      qualification: 'MBBS, MD',
      location: 'Vijayawada, AP',
      appliedDate: '3 days ago',
      status: 'Shortlisted',
      rating: 4.8,
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43211',
      summary: 'Highly skilled medical officer with extensive experience in patient diagnosis and treatment planning.',
      skills: ['Diagnosis', 'Treatment Planning', 'Patient Care', 'Medical Records'],
    },
    {
      id: 3,
      candidateName: 'Amit Patel',
      candidateAvatar: 'AP',
      jobTitle: 'Lab Technician',
      experience: '3 years',
      qualification: 'B.Sc MLT',
      location: 'Hyderabad, TS',
      appliedDate: '5 days ago',
      status: 'Interview Scheduled',
      rating: 4.2,
      email: 'amit.patel@email.com',
      phone: '+91 98765 43212',
      summary: 'Detail-oriented lab technician with strong analytical skills and laboratory equipment expertise.',
      skills: ['Lab Testing', 'Quality Control', 'Equipment Maintenance', 'Sample Analysis'],
    },
    {
      id: 4,
      candidateName: 'Sneha Reddy',
      candidateAvatar: 'SR',
      jobTitle: 'Physiotherapist',
      experience: '4 years',
      qualification: 'BPT, MPT',
      location: 'Guntur, AP',
      appliedDate: '1 week ago',
      status: 'Rejected',
      rating: 3.8,
      email: 'sneha.reddy@email.com',
      phone: '+91 98765 43213',
      summary: 'Certified physiotherapist specializing in rehabilitation and pain management therapies.',
      skills: ['Physical Therapy', 'Rehabilitation', 'Pain Management', 'Patient Assessment'],
    },
    {
      id: 5,
      candidateName: 'Karthik Reddy',
      candidateAvatar: 'KR',
      jobTitle: 'Senior Nurse - ICU',
      experience: '6 years',
      qualification: 'B.Sc Nursing, MSc',
      location: 'Vijayawada, AP',
      appliedDate: '1 week ago',
      status: 'Shortlisted',
      rating: 4.6,
      email: 'karthik.reddy@email.com',
      phone: '+91 98765 43214',
      summary: 'Senior ICU nurse with advanced certification and team leadership experience.',
      skills: ['ICU Care', 'Team Leadership', 'Critical Thinking', 'Emergency Protocols'],
    },
    {
      id: 6,
      candidateName: 'Deepa Singh',
      candidateAvatar: 'DS',
      jobTitle: 'Medical Officer',
      experience: '7 years',
      qualification: 'MBBS',
      location: 'Hyderabad, TS',
      appliedDate: '2 weeks ago',
      status: 'Pending',
      rating: 4.4,
      email: 'deepa.singh@email.com',
      phone: '+91 98765 43215',
      summary: 'Dedicated medical officer with comprehensive knowledge of general medicine and patient care.',
      skills: ['General Medicine', 'Patient Consultation', 'Diagnosis', 'Treatment'],
    },
  ]);

  const jobs = [
    { id: 'all', title: 'All Jobs' },
    { id: 'icu-nurse', title: 'Senior Nurse - ICU' },
    { id: 'medical-officer', title: 'Medical Officer' },
    { id: 'lab-tech', title: 'Lab Technician' },
    { id: 'physio', title: 'Physiotherapist' },
  ];

  const stats = useMemo(
    () => [
      {
        label: 'Total Applications',
        value: applications.length.toString(),
        icon: Clock,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
      },
      {
        label: 'Pending Review',
        value: applications.filter((a) => a.status === 'Pending').length.toString(),
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
      },
      {
        label: 'Shortlisted',
        value: applications.filter((a) => a.status === 'Shortlisted').length.toString(),
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-50',
      },
      {
        label: 'Rejected',
        value: applications.filter((a) => a.status === 'Rejected').length.toString(),
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-50',
      },
    ],
    [applications]
  );

  const openMailClient = ({ to, subject, body }) => {
    if (!to) return;
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const sendStatusEmail = (application, newStatus, reason = '') => {
    const subject = `MCARE Application Update - ${newStatus}`;
    const greeting = `Hello ${application.candidateName},`;
    const line1 = `Your application for "${application.jobTitle}" has been ${newStatus.toLowerCase()}.`;
    const line2 =
      newStatus === 'Rejected' && reason?.trim() ? `Reason: ${reason.trim()}` : '';
    const closing = `\n\nRegards,\nMCARE Team`;
    const body = [greeting, '', line1, line2, closing].filter(Boolean).join('\n');
    openMailClient({ to: application.email, subject, body });
  };

  const normalizeStatus = (s) =>
    String(s).toLowerCase().trim().replace(/\s+/g, '-');

  const filteredApplications = useMemo(() => {
    const jobObj = jobs.find((j) => j.id === selectedJob);
    return applications.filter((app) => {
      const statusMatch =
        filterStatus === 'all' || normalizeStatus(app.status) === filterStatus;

      const jobMatch = selectedJob === 'all' || app.jobTitle === jobObj?.title;

      const q = searchTerm.trim().toLowerCase();
      const searchMatch =
        !q ||
        app.candidateName.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q) ||
        app.jobTitle.toLowerCase().includes(q);

      return statusMatch && jobMatch && searchMatch;
    });
  }, [applications, filterStatus, selectedJob, searchTerm]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: { bg: 'bg-yellow-50', text: 'text-yellow-600', icon: Clock },
      Shortlisted: { bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle },
      'Interview Scheduled': { bg: 'bg-blue-50', text: 'text-blue-600', icon: Clock },
      Rejected: { bg: 'bg-red-50', text: 'text-red-600', icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} inline-flex items-center space-x-1`}
      >
        <Icon className="w-4 h-4" />
        <span>{status}</span>
      </span>
    );
  };

  const handleViewDetails = (application) => {
    setSelectedApplication(application);
    setShowDetailsModal(true);
  };

  const handleShortlistClick = (application) => {
    setSelectedApplication(application);
    setShowShortlistModal(true);
  };

  const handleRejectClick = (application) => {
    setSelectedApplication(application);
    setShowRejectModal(true);
  };

  const handleConfirmShortlist = () => {
    if (!selectedApplication) return;

    const updated = { ...selectedApplication, status: 'Shortlisted' };
    setApplications((prev) =>
      prev.map((app) => (app.id === selectedApplication.id ? updated : app))
    );

    setShowShortlistModal(false);
    setSelectedApplication(null);

    sendStatusEmail(updated, 'Shortlisted');

    setSuccessMessage(
      `Candidate shortlisted. Email prepared for ${updated.candidateName}.`
    );
    setShowSuccessModal(true);
  };

  const handleConfirmReject = () => {
    if (!selectedApplication) return;

    const updated = { ...selectedApplication, status: 'Rejected' };
    setApplications((prev) =>
      prev.map((app) => (app.id === selectedApplication.id ? updated : app))
    );

    setShowRejectModal(false);
    setSelectedApplication(null);

    const reason = rejectReason;
    setRejectReason('');

    sendStatusEmail(updated, 'Rejected', reason);

    setSuccessMessage(
      `Candidate rejected. Email prepared for ${updated.candidateName}.`
    );
    setShowSuccessModal(true);
  };

  const handleDownloadResume = (application) => {
    setSuccessMessage(`Downloading resume for ${application.candidateName}...`);
    setShowSuccessModal(true);
  };

  const handleSendMessage = (application) => {
    const subject = 'MCARE - Regarding your application';
    const body = `Hello ${application.candidateName},\n\n`;
    openMailClient({ to: application.email, subject, body });
    setSuccessMessage(`Email opened for ${application.candidateName}.`);
    setShowSuccessModal(true);
  };

  return (
    <div>
      <Sidebar />

      {/* ✅ Responsive wrapper:
          - Mobile: no left margin + top padding for hamburger
          - Desktop: ml-64 (unchanged) */}
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 pt-16 md:pt-6 md:ml-64">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Applications
          </h1>
          <p className="text-gray-600 mt-1">
            Review and manage candidate applications
          </p>
        </div>

        {/* ✅ Stats responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ Filters responsive */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-semibold text-gray-900">Filters</span>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            {/* Job Filter */}
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Position
              </label>
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full lg:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter buttons */}
            <div className="w-full">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'shortlisted', label: 'Shortlisted' },
                  { id: 'interview-scheduled', label: 'Interviews' },
                  { id: 'rejected', label: 'Rejected' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setFilterStatus(b.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      filterStatus === b.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Desktop table + Mobile cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Candidate
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Job Position
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Qualification
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Experience
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Rating
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {application.candidateAvatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {application.candidateName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {application.location}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div>
                        <p className="text-gray-900">{application.jobTitle}</p>
                        <p className="text-sm text-gray-500">
                          Applied {application.appliedDate}
                        </p>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-gray-900">
                      {application.qualification}
                    </td>
                    <td className="py-4 px-6 text-gray-900">
                      {application.experience}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="font-medium text-gray-900">
                          {application.rating}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6">{getStatusBadge(application.status)}</td>

                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(application)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>

                        <button
                          onClick={() => handleDownloadResume(application)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Download Resume"
                        >
                          <Download className="w-4 h-4 text-gray-600" />
                        </button>

                        <button
                          onClick={() => handleSendMessage(application)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4 text-gray-600" />
                        </button>

                        {application.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleShortlistClick(application)}
                              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                              title="Shortlist"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </button>
                            <button
                              onClick={() => handleRejectClick(application)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {application.candidateAvatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {application.candidateName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {application.jobTitle}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied {application.appliedDate} • {application.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">{getStatusBadge(application.status)}</div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Qualification</p>
                    <p className="font-medium text-gray-900 truncate">
                      {application.qualification}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="font-medium text-gray-900">
                      {application.experience}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-gray-900">
                      {application.rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(application)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>

                    <button
                      onClick={() => handleDownloadResume(application)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      title="Download Resume"
                    >
                      <Download className="w-4 h-4 text-gray-700" />
                    </button>

                    <button
                      onClick={() => handleSendMessage(application)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4 text-gray-700" />
                    </button>

                    {application.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleShortlistClick(application)}
                          className="p-2 border border-green-200 rounded-lg hover:bg-green-50"
                          title="Shortlist"
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => handleRejectClick(application)}
                          className="p-2 border border-red-200 rounded-lg hover:bg-red-50"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4 text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No applications found matching your filters
            </p>
          </div>
        )}

        {/* View Details Modal */}
        {showDetailsModal && selectedApplication && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title="Application Details"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4 pb-4 border-b">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                  {selectedApplication.candidateAvatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedApplication.candidateName}
                  </h3>
                  <p className="text-gray-600">{selectedApplication.jobTitle}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-gray-900">
                      {selectedApplication.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900">{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-900">{selectedApplication.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedApplication.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Experience</p>
                  <p className="text-gray-900 flex items-center">
                    <Briefcase className="w-4 h-4 mr-1" />
                    {selectedApplication.experience}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Qualification</h4>
                <p className="text-gray-700">{selectedApplication.qualification}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Professional Summary
                </h4>
                <p className="text-gray-700">{selectedApplication.summary}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Key Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApplication.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => handleDownloadResume(selectedApplication)}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </button>

                {selectedApplication.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleShortlistClick(selectedApplication);
                      }}
                      className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Shortlist</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailsModal(false);
                        handleRejectClick(selectedApplication);
                      }}
                      className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* Shortlist Confirmation Modal */}
        {showShortlistModal && selectedApplication && (
          <Modal
            isOpen={showShortlistModal}
            onClose={() => setShowShortlistModal(false)}
            title="Shortlist Candidate"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to shortlist{' '}
                <span className="font-semibold">
                  {selectedApplication.candidateName}
                </span>{' '}
                for{' '}
                <span className="font-semibold">
                  {selectedApplication.jobTitle}
                </span>
                ?
              </p>
              <p className="text-sm text-gray-500">
                An email will open to notify the candidate about the shortlist
                status.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowShortlistModal(false)}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmShortlist}
                  className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Confirm Shortlist
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Reject Confirmation Modal */}
        {showRejectModal && selectedApplication && (
          <Modal
            isOpen={showRejectModal}
            onClose={() => setShowRejectModal(false)}
            title="Reject Application"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to reject the application from{' '}
                <span className="font-semibold">
                  {selectedApplication.candidateName}
                </span>
                ?
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection (Optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Provide feedback to the candidate..."
                />
              </div>
              <p className="text-sm text-gray-500">
                An email will open to notify the candidate about the rejection
                status.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <Modal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title="Success"
          >
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-lg text-gray-900">{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
              >
                Close
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Applications;