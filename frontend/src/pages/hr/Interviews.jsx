import { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, MapPin, User, Video, Phone, X, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import CustomSelect from '../../components/common/CustomSelect';
import employerService from '../../api/employerService';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [filter, setFilter] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    candidateName: '',
    position: '',
    date: '',
    time: '',
    type: 'Video Call',
    interviewer: '',
    location: '',
  });

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true);
      try {
        const data = await employerService.getInterviews();
        const interviewsArray = Array.isArray(data) ? data : [];
        setInterviews(interviewsArray);
      } catch (error) {
        console.error('Failed to fetch interviews:', error);
        setInterviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const filteredInterviews = useMemo(() => {
    const interviewsArray = Array.isArray(interviews) ? interviews : [];
    return interviewsArray.filter((interview) => filter === 'all' || interview.status === filter);
  }, [interviews, filter]);

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-teal-100 text-teal-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status] || styles.upcoming;
  };

  const getTypeIcon = (type) => {
    if (type === 'Video Call') return <Video className="w-5 h-5" />;
    if (type === 'Phone') return <Phone className="w-5 h-5" />;
    return <MapPin className="w-5 h-5" />;
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleJoinInterview = (interview) => {
    if (interview.type === 'Video Call') {
      showNotification(`Joining video call for ${interview.candidateName}...`);
      setTimeout(() => {
        window.open('https://zoom.us/j/example', '_blank');
      }, 500);
    } else if (interview.type === 'Phone') {
      showNotification(`Calling ${interview.candidateName}...`);
    } else {
      showNotification(`Interview location: ${interview.location}`);
    }
  };

  const handleScheduleInterview = () => {
    setShowScheduleModal(true);
    setFormData({
      candidateName: '',
      position: '',
      date: '',
      time: '',
      type: 'Video Call',
      interviewer: '',
      location: '',
    });
  };

  const handleReschedule = (interview) => {
    setSelectedInterview(interview);
    setFormData({
      candidateName: interview.candidateName,
      position: interview.position,
      date: interview.date,
      time: interview.time,
      type: interview.type,
      interviewer: interview.interviewer,
      location: interview.location,
    });
    setShowRescheduleModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    const newInterview = {
      id: interviews.length + 1,
      ...formData,
      status: 'upcoming',
    };
    setInterviews((prev) => [...prev, newInterview]);
    setShowScheduleModal(false);
    showNotification(`Interview scheduled with ${formData.candidateName}`);
  };

  const handleSubmitReschedule = (e) => {
    e.preventDefault();
    setInterviews((prev) =>
      prev.map((int) => (int.id === selectedInterview.id ? { ...int, ...formData } : int))
    );
    setShowRescheduleModal(false);
    showNotification(`Interview rescheduled for ${formData.candidateName}`);
  };

  return (
    <div>
      <Sidebar />

      {/* ✅ Desktop preserved: md:ml-64 + md:p-6.
          ✅ Mobile: ml-0 + pt-16 so header moves down (when sidebar/topbar exists). */}
      <div className="ml-0 md:ml-64 min-h-screen bg-gray-50 p-4 md:p-6 pt-16 md:pt-6">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Interviews</h1>
            <p className="text-gray-600 mt-2 text-sm md:text-base">Schedule and manage candidate interviews</p>
          </div>

          <button
            onClick={handleScheduleInterview}
            className="w-full md:w-auto bg-gradient-to-r from-teal-700 to-emerald-500 text-white px-5 py-3 rounded-lg hover:from-teal-800 hover:to-emerald-600 font-medium"
          >
            Schedule Interview
          </button>
        </div>

        {/* Filter Tabs (scrollable on mobile) */}
        <div className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {['upcoming', 'completed', 'all'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'bg-gradient-to-r from-teal-700 to-emerald-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Desktop list (same structure), Mobile uses stacked layout inside card */}
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <div key={interview.id} className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                {/* Left */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{interview.candidateName}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm md:text-base">{interview.position}</p>

                  {/* Details grid: 2 cols mobile, 4 cols desktop */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="truncate">{interview.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="truncate">{interview.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      {getTypeIcon(interview.type)}
                      <span className="truncate">{interview.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span className="truncate">{interview.interviewer}</span>
                    </div>
                  </div>

                  {/* Location line (nice on mobile) */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{interview.location}</span>
                  </div>
                </div>

                {/* Actions: full-width on mobile, vertical on desktop */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 md:ml-4">
                  <button
                    onClick={() => handleJoinInterview(interview)}
                    className="w-full md:w-auto px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-700 text-sm"
                  >
                    Join Interview
                  </button>
                  <button
                    onClick={() => handleReschedule(interview)}
                    className="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredInterviews.length === 0 && (
            <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100 text-gray-600">
              No interviews found.
            </div>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-10 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowScheduleModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmitSchedule}>
                <div className="bg-white px-6 pt-5 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Schedule Interview</h3>
                    <button
                      type="button"
                      onClick={() => setShowScheduleModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* ✅ Mobile friendly: 1 col on small screens, 2 cols on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name</label>
                      <input
                        type="text"
                        name="candidateName"
                        value={formData.candidateName}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      >
                        <option value="Video Call">Video Call</option>
                        <option value="Phone">Phone</option>
                        <option value="In-Person">In-Person</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interviewer</label>
                      <input
                        type="text"
                        name="interviewer"
                        value={formData.interviewer}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location / Link</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleFormChange}
                        required
                        placeholder="Zoom link, office location, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600"
                  >
                    Schedule Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Interview Modal */}
      {showRescheduleModal && selectedInterview && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 py-10 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowRescheduleModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmitReschedule}>
                <div className="bg-white px-6 pt-5 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">Reschedule Interview</h3>
                    <button
                      type="button"
                      onClick={() => setShowRescheduleModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  {/* ✅ Mobile friendly: 1 col on small screens, 2 cols on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name</label>
                      <input
                        type="text"
                        name="candidateName"
                        value={formData.candidateName}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interview Type</label>
                      <CustomSelect
                        name="type"
                        value={formData.type}
                        onChange={handleFormChange}
                        options={['Video Call', 'Phone', 'In-Person']}
                        placeholder="Video Call"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Interviewer</label>
                      <input
                        type="text"
                        name="interviewer"
                        value={formData.interviewer}
                        onChange={handleFormChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location / Link</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleFormChange}
                        required
                        placeholder="Zoom link, office location, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowRescheduleModal(false)}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600"
                  >
                    Update Interview
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50">
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

export default Interviews;