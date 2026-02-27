import { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X,
  Star,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('all');

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
      setCandidates([
        {
          id: 1,
          name: 'Sarah Johnson',
          email: 'sarah.j@example.com',
          phone: '+91 98765 43210',
          specialization: 'Registered Nurse',
          experience: '5 years',
          location: 'Guntur, AP',
          rating: 4.5,
          applications: 3,
          status: 'Available',
        },
        {
          id: 2,
          name: 'Michael Chen',
          email: 'michael.c@example.com',
          phone: '+91 98765 43211',
          specialization: 'Physical Therapist',
          experience: '3 years',
          location: 'Vijayawada, AP',
          rating: 4.8,
          applications: 2,
          status: 'Available',
        },
        {
          id: 3,
          name: 'Emily Davis',
          email: 'emily.d@example.com',
          phone: '+91 98765 43212',
          specialization: 'Lab Technician',
          experience: '2 years',
          location: 'Guntur, AP',
          rating: 4.2,
          applications: 4,
          status: 'Interviewing',
        },
        {
          id: 4,
          name: 'David Wilson',
          email: 'david.w@example.com',
          phone: '+91 98765 43213',
          specialization: 'Pharmacist',
          experience: '4 years',
          location: 'Hyderabad, TS',
          rating: 4.6,
          applications: 1,
          status: 'Available',
        },
      ]);
    };
    fetchCandidates();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      Available: 'bg-green-100 text-green-800',
      Interviewing: 'bg-yellow-100 text-yellow-800',
      Hired: 'bg-blue-100 text-blue-800',
      Rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.Available;
  };

  const filteredCandidates = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(q) || candidate.specialization.toLowerCase().includes(q);

      const matchesFilter = filterSpecialization === 'all' || candidate.specialization === filterSpecialization;

      return matchesSearch && matchesFilter;
    });
  }, [candidates, searchTerm, filterSpecialization]);

  const handleViewCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowViewModal(true);
  };

  const handleAccept = (candidate) => {
    setSelectedCandidate(candidate);
    setConfirmAction('accept');
    setShowConfirmModal(true);
  };

  const handleReject = (candidate) => {
    setSelectedCandidate(candidate);
    setConfirmAction('reject');
    setShowConfirmModal(true);
  };

  const showNotificationMsg = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDownloadResume = (candidate) => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${candidate.name.replace(/\s+/g, '_')}_Resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotificationMsg(`Downloading resume for ${candidate.name}`, 'info');
  };

  const confirmActionHandler = () => {
    if (!selectedCandidate) return;

    if (confirmAction === 'accept') {
      setCandidates((prev) => prev.map((c) => (c.id === selectedCandidate.id ? { ...c, status: 'Hired' } : c)));
      showNotificationMsg(`${selectedCandidate.name} has been accepted and hired!`, 'success');
    } else if (confirmAction === 'reject') {
      setCandidates((prev) => prev.map((c) => (c.id === selectedCandidate.id ? { ...c, status: 'Rejected' } : c)));
      showNotificationMsg(`${selectedCandidate.name} has been rejected.`, 'info');
    }

    setShowConfirmModal(false);
    setSelectedCandidate(null);
    setConfirmAction(null);
  };

  const avgRating = useMemo(() => {
    if (!candidates.length) return '0.0';
    const avg = candidates.reduce((sum, c) => sum + (Number(c.rating) || 0), 0) / candidates.length;
    return avg.toFixed(1);
  }, [candidates]);

  return (
    <div>
      <Sidebar />

      {/* ✅ Desktop preserved: md:ml-64. ✅ Mobile: ml-0 + pt-16 to move header down */}
      <div className="ml-0 md:ml-64 min-h-screen bg-gray-50 p-4 md:p-6 pt-16 md:pt-6">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Candidate Database</h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">Browse and manage all candidates</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="text-xs md:text-sm text-gray-600 mb-1">Total Candidates</div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900">{candidates.length}</div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="text-xs md:text-sm text-gray-600 mb-1">Available</div>
            <div className="text-2xl md:text-3xl font-bold text-green-600">
              {candidates.filter((c) => c.status === 'Available').length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="text-xs md:text-sm text-gray-600 mb-1">Interviewing</div>
            <div className="text-2xl md:text-3xl font-bold text-yellow-600">
              {candidates.filter((c) => c.status === 'Interviewing').length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
            <div className="text-xs md:text-sm text-gray-600 mb-1">Avg Rating</div>
            <div className="text-2xl md:text-3xl font-bold text-cyan-600">{avgRating}</div>
          </div>
        </div>

        {/* Search + Filter (stack on mobile) */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <Filter className="w-5 h-5 text-gray-400 shrink-0" />
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full lg:w-72 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="all">All Specializations</option>
                <option value="Registered Nurse">Registered Nurse</option>
                <option value="Physical Therapist">Physical Therapist</option>
                <option value="Lab Technician">Lab Technician</option>
                <option value="Pharmacist">Pharmacist</option>
              </select>
            </div>
          </div>
        </div>

        {/* ✅ Desktop Table (unchanged feel) */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {candidate.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                          <div className="text-sm text-gray-500">{candidate.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.experience}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.location}</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{candidate.rating}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {candidate.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewCandidate(candidate)}
                        className="text-cyan-600 hover:text-cyan-900"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAccept(candidate)}
                        className="text-green-600 hover:text-green-900"
                        title="Accept Candidate"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleReject(candidate)}
                        className="text-red-600 hover:text-red-900"
                        title="Reject Candidate"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadResume(candidate)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Download Resume"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ✅ Mobile/Tablet Cards (no effect on desktop) */}
        <div className="lg:hidden space-y-4">
          {filteredCandidates.map((c) => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-11 h-11 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    {c.name.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                    <p className="text-sm text-gray-600 truncate">{c.specialization}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900">{c.rating}</span>
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{c.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate">{c.experience}</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 justify-end">
                <button
                  onClick={() => handleViewCandidate(c)}
                  className="px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>

                <button
                  onClick={() => handleAccept(c)}
                  className="px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </button>

                <button
                  onClick={() => handleReject(c)}
                  className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-sm font-medium inline-flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Reject
                </button>

                <button
                  onClick={() => handleDownloadResume(c)}
                  className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-medium inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Resume
                </button>
              </div>
            </div>
          ))}

          {filteredCandidates.length === 0 && (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
              <Search className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No Candidates Found</h3>
              <p className="text-gray-600 text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* View Candidate Modal */}
      {showViewModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-10 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowViewModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 pt-5 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">Candidate Details</h3>
                  <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {selectedCandidate.name.charAt(0)}
                    </div>
                    <div className="ml-4 min-w-0">
                      <h4 className="text-xl font-bold text-gray-900 truncate">{selectedCandidate.name}</h4>
                      <p className="text-gray-600">{selectedCandidate.specialization}</p>
                      <div className="flex items-center mt-1 flex-wrap gap-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-900">{selectedCandidate.rating}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCandidate.status)}`}>
                          {selectedCandidate.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900 break-all">{selectedCandidate.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{selectedCandidate.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm font-medium text-gray-900">{selectedCandidate.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Experience</p>
                        <p className="text-sm font-medium text-gray-900">{selectedCandidate.experience}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-500">Applications Submitted</p>
                    <p className="text-lg font-bold text-gray-900">{selectedCandidate.applications}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => handleDownloadResume(selectedCandidate)}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resume</span>
                </button>
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

      {/* Confirm Action Modal */}
      {showConfirmModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-10 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowConfirmModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-5 pb-4">
                <div className="sm:flex sm:items-start">
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
                      confirmAction === 'accept' ? 'bg-green-100' : 'bg-red-100'
                    } sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    {confirmAction === 'accept' ? <Check className="h-6 w-6 text-green-600" /> : <X className="h-6 w-6 text-red-600" />}
                  </div>

                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {confirmAction === 'accept' ? 'Accept Candidate' : 'Reject Candidate'}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to {confirmAction}{' '}
                        <span className="font-semibold">{selectedCandidate.name}</span>?
                        {confirmAction === 'accept' && ' This will mark them as hired.'}
                        {confirmAction === 'reject' && ' This action can be undone by changing their status later.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  onClick={confirmActionHandler}
                  className={`w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${
                    confirmAction === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  } sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {confirmAction === 'accept' ? 'Accept' : 'Reject'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:w-auto sm:text-sm"
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
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`flex items-center space-x-3 px-6 py-4 rounded-lg shadow-lg ${
              notification.type === 'success' ? 'bg-green-500' : notification.type === 'info' ? 'bg-blue-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
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

export default Candidates;