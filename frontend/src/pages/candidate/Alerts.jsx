import { useEffect, useRef, useState } from 'react';
import { Bell, Plus, Briefcase, Trash2, Edit2, CheckCircle, X, AlertCircle } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import { alertService } from '../../api/alertService';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load alerts from backend on mount
  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const data = await alertService.getUserAlerts();
        // Ensure data is an array
        const alertsArray = Array.isArray(data) ? data : [];
        setAlerts(alertsArray);
      } catch (error) {
        console.error('Failed to fetch alerts:', error);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [selectedAlert, setSelectedAlert] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    keywords: '',
    location: '',
    jobType: 'Full-time',
    frequency: 'Daily',
  });

  const firstInputRef = useRef(null);

  // Auto focus input when create/edit modal opens
  useEffect(() => {
    if (showCreateModal || showEditModal) {
      setTimeout(() => firstInputRef.current?.focus(), 50);
    }
  }, [showCreateModal, showEditModal]);

  // ESC close for modals
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setShowCreateModal(false);
      setShowEditModal(false);
      setShowDeleteModal(false);
      setShowSuccessModal(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const buildCriteria = (keywords, location, jobType) => `${keywords} • ${location} • ${jobType}`;

  const handleToggleAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, active: !alert.active } : alert))
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --------------------------
  // CREATE
  // --------------------------
  const openCreate = () => {
    setFormData({
      title: '',
      keywords: '',
      location: '',
      jobType: 'Full-time',
      frequency: 'Daily',
    });
    setSelectedAlert(null);
    setShowCreateModal(true);
  };

  const handleCreateAlert = (e) => {
    e.preventDefault();

    const title = formData.title.trim();
    const keywords = formData.keywords.trim();
    const location = formData.location.trim();

    if (!title || !keywords || !location) return;

    const newAlert = {
      id: Date.now(),
      title,
      keywords,
      location,
      jobType: formData.jobType,
      criteria: buildCriteria(keywords, location, formData.jobType),
      frequency: formData.frequency,
      active: true,
      matchingJobs: Math.floor(Math.random() * 20) + 1,
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setShowCreateModal(false);

    setSuccessMessage('Job alert created successfully!');
    setShowSuccessModal(true);
  };

  // --------------------------
  // EDIT
  // --------------------------
  const openEdit = (alert) => {
    setSelectedAlert(alert);
    setFormData({
      title: alert.title || '',
      keywords: alert.keywords || '',
      location: alert.location || '',
      jobType: alert.jobType || 'Full-time',
      frequency: alert.frequency || 'Daily',
    });
    setShowEditModal(true);
  };

  const handleUpdateAlert = (e) => {
    e.preventDefault();
    if (!selectedAlert) return;

    const title = formData.title.trim();
    const keywords = formData.keywords.trim();
    const location = formData.location.trim();

    if (!title || !keywords || !location) return;

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === selectedAlert.id
          ? {
              ...a,
              title,
              keywords,
              location,
              jobType: formData.jobType,
              frequency: formData.frequency,
              criteria: buildCriteria(keywords, location, formData.jobType),
            }
          : a
      )
    );

    setShowEditModal(false);
    setSelectedAlert(null);

    setSuccessMessage('Job alert updated successfully!');
    setShowSuccessModal(true);
  };

  // --------------------------
  // DELETE
  // --------------------------
  const openDelete = (alert) => {
    setSelectedAlert(alert);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (!selectedAlert) return;
    const title = selectedAlert.title;

    setAlerts((prev) => prev.filter((a) => a.id !== selectedAlert.id));
    setShowDeleteModal(false);
    setSelectedAlert(null);

    setSuccessMessage(`Deleted: "${title}"`);
    setShowSuccessModal(true);
  };

  return (
    <div>
      <Sidebar />

      <div className="md:ml-64 min-h-screen bg-gray-50 pt-16 md:pt-6 p-4 md:p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Job Alerts</h1>
            <p className="text-gray-600 mt-1">Get notified when new jobs match your preferences</p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white px-5 py-3 rounded-lg hover:from-teal-800 hover:to-emerald-600 font-medium w-full md:w-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create Alert</span>
          </button>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">{alert.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {alert.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3 text-sm md:text-base">{alert.criteria}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Bell className="w-4 h-4" />
                      {alert.frequency}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {alert.matchingJobs} jobs
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => openEdit(alert)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                    title="Edit"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => openDelete(alert)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer ml-1">
                    <input
                      type="checkbox"
                      checked={alert.active}
                      onChange={() => handleToggleAlert(alert.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {alerts.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-100">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">No Job Alerts</h2>
            <p className="text-gray-600 mb-6">Create alerts to get notified about new job opportunities</p>
            <button
              onClick={openCreate}
              className="bg-gradient-to-r from-teal-700 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-teal-800 hover:to-emerald-600 font-medium"
            >
              Create Your First Alert
            </button>
          </div>
        )}
      </div>

      {/* ---------------------------
          CREATE MODAL
         --------------------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateModal(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Create Job Alert</h3>
                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleCreateAlert} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title</label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., ICU Nurse Jobs"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    placeholder="e.g., Senior Nurse"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Hyderabad"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gradient-to-r from-teal-700 to-emerald-500 text-white hover:from-teal-800 hover:to-emerald-600"
                  >
                    Create Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------
          EDIT MODAL
         --------------------------- */}
      {showEditModal && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowEditModal(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Edit Job Alert</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <form onSubmit={handleUpdateAlert} className="px-6 py-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title</label>
                  <input
                    ref={firstInputRef}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                    <select
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gradient-to-r from-teal-700 to-emerald-500 text-white hover:from-teal-800 hover:to-emerald-600"
                  >
                    Update Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------
          DELETE MODAL
         --------------------------- */}
      {showDeleteModal && selectedAlert && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowDeleteModal(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">Delete Alert</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Are you sure you want to delete{' '}
                      <span className="font-semibold text-gray-900">"{selectedAlert.title}"</span>? This cannot be undone.
                    </p>
                  </div>
                  <button onClick={() => setShowDeleteModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSuccessModal(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <p className="text-lg font-semibold text-gray-900">{successMessage}</p>

                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="mt-6 w-full px-5 py-2 rounded-lg bg-gradient-to-r from-teal-700 to-emerald-500 text-white hover:from-teal-800 hover:to-emerald-600"
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

export default Alerts;