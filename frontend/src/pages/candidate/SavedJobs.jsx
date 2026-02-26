import { useState, useEffect } from 'react';
import { Heart, MapPin, Briefcase, DollarSign, Clock, Trash2, CheckCircle, Building2, Upload as UploadIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/useAuth';

const SavedJobs = () => {
  const { token } = useAuth();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  
  // Form State - Updated for File Upload
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [availability, setAvailability] = useState('');

  /**
   * 📅 Helper: Calculate Tomorrow's Date for Input Restrictions
   */
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  /**
   * 🚀 1. Fetch Saved Jobs from Backend
   */
  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_BASE}/api/candidate/saved-jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSavedJobs(data.jobs);
      }
    } catch (err) {
      console.error("❌ Error fetching saved jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchSavedJobs();
  }, [token]);

  /**
   * 🗑️ 2. Confirm and Remove from Database
   */
  const handleConfirmRemove = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_BASE}/api/candidate/saved-jobs/${selectedJob.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSavedJobs(savedJobs.filter(job => job.id !== selectedJob.id));
        setShowRemoveModal(false);
        setSelectedJob(null);
      }
    } catch (err) {
      alert("Error removing job");
    }
  };

  /**
   * 📝 3. Submit Live Application using FormData
   */
  const handleSubmitApplication = async () => {
    if (!availability) {
      alert("Please select your availability date.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append('job_id', selectedJob.id);
      formData.append('availability', availability);
      if (coverLetterFile) {
        formData.append('coverLetter', coverLetterFile);
      }

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_BASE}/api/candidate/apply`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}` 
          // Do NOT set Content-Type; browser sets boundary for FormData
        },
        body: formData
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSuccessMessage(`Application submitted for ${selectedJob.title}!`);
        setShowSuccessModal(true);
        setShowApplyModal(false);
        setCoverLetterFile(null);
        setAvailability('');
        // Refresh list to potentially show "Applied" state if implemented in backend
        fetchSavedJobs();
      } else {
        alert(data.message || "Failed to apply");
      }
    } catch (err) {
      console.error("❌ Application error:", err);
      alert("Server connection failed");
    }
  };

  const handleRemoveClick = (job) => { setSelectedJob(job); setShowRemoveModal(true); };
  const handleApplyClick = (job) => { setSelectedJob(job); setShowApplyModal(true); };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-2">{savedJobs.length} roles bookmarked for your clinical career</p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Retrieving your saved roles...</div>
        ) : savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">Start saving jobs you're interested in while browsing</p>
            <Link to="/candidate/browse-jobs" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-bold">Browse Available Jobs</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {savedJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 relative group">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-4">
                        <Briefcase className="w-6 h-6 text-cyan-600" />
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-gray-900 mb-1">{job.title}</h3>
                    <div className="flex items-center text-cyan-600 font-bold mb-4">
                        <Building2 className="w-4 h-4 mr-1" /> {job.company_name}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                      <div className="flex items-center space-x-1"><MapPin className="w-4 h-4 text-cyan-500" /><span>{job.location}</span></div>
                      <div className="flex items-center space-x-1"><DollarSign className="w-4 h-4 text-green-600" /><span>Rs. {job.salary || 'Competitive'}</span></div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleApplyClick(job)} 
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-xl hover:bg-blue-700 font-bold transition-all shadow-sm"
                      >
                        Apply Now
                      </button>
                      <button 
                        onClick={() => handleRemoveClick(job)} 
                        className="flex items-center space-x-2 text-red-500 hover:text-red-700 font-bold px-4 py-2 border border-red-50 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- MODALS --- */}

        {/* Remove Modal */}
        {showRemoveModal && (
          <Modal isOpen={showRemoveModal} onClose={() => setShowRemoveModal(false)} title="Remove Bookmark">
            <div className="p-2">
              <p className="text-gray-600 mb-6 text-lg">Remove <span className="font-bold text-gray-900">{selectedJob?.title}</span> from your wishlist?</p>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowRemoveModal(false)} className="px-6 py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleConfirmRemove} className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">Remove Permanently</button>
              </div>
            </div>
          </Modal>
        )}

        {/* Apply Modal - Updated for PDF Upload and Offere Salary Display */}
        {showApplyModal && (
          <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title={`Apply: ${selectedJob?.title}`}>
            <div className="space-y-6">
              {/* Salary Display */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Offered Salary</p>
                <p className="text-lg font-bold text-gray-900">Rs. {selectedJob?.salary}</p>
              </div>

              {/* PDF File Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Cover Letter (PDF)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    id="saved-cv-upload"
                    className="hidden"
                    onChange={(e) => setCoverLetterFile(e.target.files[0])}
                  />
                  <label htmlFor="saved-cv-upload" className="cursor-pointer">
                    <UploadIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-blue-600">
                      {coverLetterFile ? coverLetterFile.name : "Select Cover Letter File"}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Earliest Availability</label>
                <input
                  required
                  type="date"
                  min={getTomorrowDate()} // 🛑 RESTRICTS TO TOMORROW OR LATER
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button 
                onClick={handleSubmitApplication} 
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
              >
                Confirm Application
              </button>
            </div>
          </Modal>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Success">
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-bold text-gray-900">{successMessage}</p>
              <button onClick={() => setShowSuccessModal(false)} className="mt-6 px-10 py-3 bg-blue-600 text-white rounded-xl font-bold">Great</button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default SavedJobs;