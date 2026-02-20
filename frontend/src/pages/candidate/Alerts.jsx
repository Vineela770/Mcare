import { useState, useEffect } from 'react';
import { Bell, Plus, Briefcase, Trash2, Edit2, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';

const Alerts = () => {
  const { token } = useAuth();
  
  // 🛠️ State Management
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
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
    frequency: 'Daily'
  });

  // 📂 1. Fetch real alerts from the database
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/candidate/alerts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAlerts(data.alerts);
      }
    } catch (error) {
      console.error("❌ Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAlerts();
  }, [token]);

  // ➕ 2. Create Alert (Backend Integrated)
  const handleCreateAlert = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/candidate/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setShowCreateModal(false);
        setFormData({ title: '', keywords: '', location: '', jobType: 'Full-time', frequency: 'Daily' });
        setSuccessMessage('Job alert created successfully!');
        setShowSuccessModal(true);
        fetchAlerts(); 
      }
    } catch (error) {
      console.error("❌ Create Error:", error);
    }
  };

  // 🔘 3. Toggle Alert Status (Backend Integrated)
  const handleToggleAlert = async (alertId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/api/candidate/alerts/toggle/${alertId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      if (response.ok) {
        setAlerts(alerts.map(alert =>
          alert.id === alertId ? { ...alert, is_active: !currentStatus } : alert
        ));
      }
    } catch (error) {
      console.error("❌ Toggle Error:", error);
    }
  };

  // 🔄 4. Update Alert (Connecting to dedicated PUT route)
  const handleUpdateAlert = async () => {
    try {
      // ✅ UPDATED: Now points to the clean /alerts/:id endpoint instead of /toggle/:id
      // This ensures alert details like title and keywords are updated in DB
      const response = await fetch(`http://localhost:3000/api/candidate/alerts/${selectedAlert.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
           ...formData, // ✅ Sends updated title, keywords, location, jobType, frequency
           is_active: selectedAlert.is_active // Retain existing status
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowEditModal(false);
        setSuccessMessage('Job alert updated successfully!');
        setShowSuccessModal(true);
        fetchAlerts(); // ✅ Refresh the list to show new data immediately
      } else {
        alert("Failed to update alert: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Update Error:", error);
    }
  };

  // 🗑️ 5. Delete Alert
  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/candidate/alerts/${selectedAlert.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setShowDeleteModal(false);
        setSuccessMessage('Job alert deleted successfully!');
        setShowSuccessModal(true);
        fetchAlerts();
      }
    } catch (error) {
      console.error("❌ Delete Error:", error);
    }
  };

  const handleEditClick = (alert) => {
    setSelectedAlert(alert);
    // ✅ Pre-fill formData with current alert details so inputs aren't empty
    setFormData({
      title: alert.title,
      keywords: alert.keyword,
      location: alert.location,
      jobType: alert.job_type,
      frequency: alert.frequency
    });
    setShowEditModal(true);
  };

  const renderAlertForm = () => (
    <div className="space-y-4 text-left">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Alert Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Senior Nurse Jobs"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Job Title/Keywords</label>
        <input
          type="text"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          placeholder="e.g., Nurse, Doctor"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="e.g., Hyderabad"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
          <select
            value={formData.jobType}
            onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Frequency</label>
          <select
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Instant">Instant</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6 text-left">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Job Alerts</h1>
            <p className="text-gray-500 mt-1">Get notified when new jobs match your preferences</p>
          </div>
          <button
            onClick={() => {
              setFormData({ title: '', keywords: '', location: '', jobType: 'Full-time', frequency: 'Daily' });
              setShowCreateModal(true);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Create Alert</span>
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-cyan-600 w-10 h-10" /></div>
          ) : alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex justify-between items-center transition-all ${!alert.is_active ? 'bg-gray-50' : 'hover:border-cyan-200'}`}>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className={`text-xl font-bold ${alert.is_active ? 'text-gray-900' : 'text-gray-500'}`}>{alert.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${alert.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                      {alert.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{alert.keyword} • {alert.location} • {alert.job_type}</p>
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-400 font-bold uppercase tracking-tight">
                    <span className="flex items-center space-x-1.5"><Bell className="w-4 h-4 text-cyan-500" /><span>{alert.frequency}</span></span>
                    <span className="flex items-center space-x-1.5"><Briefcase className="w-4 h-4 text-blue-500" /><span>12 matching jobs</span></span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button onClick={() => handleEditClick(alert)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"><Edit2 className="w-5 h-5" /></button>
                  <button onClick={() => { setSelectedAlert(alert); setShowDeleteModal(true); }} className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                  <button 
                    onClick={() => handleToggleAlert(alert.id, alert.is_active)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${alert.is_active ? 'bg-cyan-500' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${alert.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-200">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Job Alerts</h2>
              <p className="text-gray-600 mb-6">Create alerts to get notified about new job opportunities</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Create Your First Alert
              </button>
            </div>
          )}
        </div>

        {/* Create Alert Modal */}
        {showCreateModal && (
          <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Job Alert">
            {renderAlertForm()}
            <div className="flex justify-end space-x-3 pt-6">
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-bold">Cancel</button>
              <button onClick={handleCreateAlert} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold shadow-md">Create Alert</button>
            </div>
          </Modal>
        )}

        {/* Edit Alert Modal */}
        {showEditModal && selectedAlert && (
          <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Job Alert">
            {renderAlertForm()}
            <div className="flex justify-end space-x-3 pt-6">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-bold">Cancel</button>
              <button 
                onClick={handleUpdateAlert} // ✅ TRIGGERS Correct PUT route logic
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold shadow-md active:scale-95"
              >
                Update Alert
              </button>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedAlert && (
          <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Job Alert">
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-bold text-gray-900">{selectedAlert.title}</span>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-bold">Cancel</button>
                <button onClick={handleConfirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold shadow-md hover:bg-red-700">Delete Permanently</button>
              </div>
            </div>
          </Modal>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Success">
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <p className="text-lg text-gray-900 font-bold">{successMessage}</p>
              <button onClick={() => setShowSuccessModal(false)} className="mt-6 px-10 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold">Got it</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Alerts;