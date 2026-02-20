import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, Heart, Upload as UploadIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';

const BrowseJobs = () => {
  const { token } = useAuth(); 
  
  // State Management
  const [jobs, setJobs] = useState([]);        
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [jobType, setJobType] = useState('all');
  
  // Modal States
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form State
  const [coverLetterFile, setCoverLetterFile] = useState(null);
  const [availability, setAvailability] = useState('');

  const locations = [
    'All Locations', 'Hyderabad', 'Bangalore', 'Delhi', 'Mumbai',
    'Kolkata', 'Pune', 'Chennai', 'Vizag', 'Guntur'
  ];

  /**
   * 📅 Helper: Formats "2 days ago" style dates
   */
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffTime = Math.abs(now - past);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return "Today";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays >= 7 && diffDays < 30) return `${Math.floor(diffDays/7)} week ago`;
    return past.toLocaleDateString();
  };

  /**
   * 📅 Helper: Tomorrow's Date for Start Restrictions
   */
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  /**
   * 🚀 Fetch live jobs with active filters from backend
   */
  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      // ✅ Build Dynamic URL with Search Parameters
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('keyword', searchTerm);
      if (location !== 'All Locations') queryParams.append('location', location);
      if (jobType !== 'all') queryParams.append('type', jobType);

      const response = await fetch(`http://localhost:3000/api/candidate/jobs?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchJobs();
  }, [token]);

  /**
   * 🔍 Trigger fetch when Search button is clicked
   */
  const handleSearch = () => {
    fetchJobs();
  };

  /**
   * 💖 Save Job to DB and update UI locally
   */
  const handleSaveJob = async (jobId) => {
    try {
      const response = await fetch('http://localhost:3000/api/candidate/saved-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ job_id: jobId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, saved: true } : job
        ));
        setSuccessMessage("Job added to your saved list!");
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("❌ Error saving job:", error);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  /**
   * 📝 Submit application with PDF upload logic
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

      const response = await fetch('http://localhost:3000/api/candidate/apply', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setSuccessMessage(`Application submitted for ${selectedJob.title}!`);
        setShowSuccessModal(true);
        setShowApplyModal(false);
        setCoverLetterFile(null);
        setAvailability('');
        fetchJobs(); // Refresh status to show "Applied"
      } else {
        alert(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("❌ Application error:", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="text-gray-600 mt-2">Find your perfect healthcare opportunity</p>
        </div>

        {/* Search & Filter UI */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg border border-transparent focus-within:border-cyan-500">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="bg-transparent border-none outline-none w-full text-gray-700"
              />
            </div>
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-400" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-gray-700 focus:ring-0 cursor-pointer"
              >
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-700 focus:ring-2 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 relative group animate-in fade-in duration-500">
                
                <button
                  onClick={() => handleSaveJob(job.id)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-red-50 transition-colors z-10"
                  title="Save for later"
                >
                  <Heart className={`w-6 h-6 transition-all duration-300 ${job.saved ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-300 hover:text-red-400'}`} />
                </button>

                <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center mb-4">
                  <Briefcase className="text-cyan-600 w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">{job.title}</h3>
                <p className="text-gray-500 font-medium mb-4">{job.company_name}</p>
                
                <div className="flex items-center space-x-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm">{job.location}</span>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-bold uppercase">
                    {job.job_type}
                  </span>
                  {/* ✅ Dynamic Salary from salary_range column */}
                  <span className="text-gray-900 font-bold text-sm">
                    {job.salary_range}
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center text-gray-400 text-xs">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>{getTimeAgo(job.created_at)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setSelectedJob(job); setShowDetailsModal(true); }}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-cyan-600 hover:bg-gray-50 transition-colors"
                    >
                      Details
                    </button>

                    {job.already_applied ? (
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold cursor-not-allowed flex items-center justify-center gap-1"
                      >
                         Applied
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApply(job)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : !loading && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-lg font-medium">No jobs found matching your criteria.</p>
              <button onClick={() => { setSearchTerm(''); setLocation('All Locations'); setJobType('all'); fetchJobs(); }} className="mt-4 text-blue-600 font-bold hover:underline">Clear all filters</button>
            </div>
          )}
        </div>

        {/* Apply Modal */}
        {showApplyModal && selectedJob && (
          <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title={`Apply for ${selectedJob.title}`}>
            <div className="space-y-6 p-2">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Offered Salary</p>
                <p className="text-lg font-bold text-gray-900">{selectedJob.salary_range}</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Upload Cover Letter (PDF)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    id="cover-upload"
                    className="hidden"
                    onChange={(e) => setCoverLetterFile(e.target.files[0])}
                  />
                  <label htmlFor="cover-upload" className="cursor-pointer">
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
                  min={getTomorrowDate()} 
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSubmitApplication}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
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

export default BrowseJobs;