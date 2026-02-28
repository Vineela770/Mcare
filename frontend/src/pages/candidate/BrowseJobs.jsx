import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Clock, Star, X, FileText, Building2, Calendar, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';
import { jobService } from '../../api/jobService';


const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [jobType, setJobType] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');

  const cities = [
    'All Locations',
    'Bangalore',
    'Delhi',
    'Mumbai',
    'Hyderabad',
    'Pune',
    'Kolkata',
    'Chennai',
    'Ahmedabad',
    'Jaipur',
    'Vizag',
    'Kurnool',
    'Coimbatore',
  ];

  useEffect(() => {
    // Fetch jobs from backend
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await jobService.getCandidateJobs();
        // API returns { success, count, jobs: [...] }
        const jobsArray = Array.isArray(data) ? data : (Array.isArray(data?.jobs) ? data.jobs : []);
        setAllJobs(jobsArray);
        setJobs(jobsArray);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setAllJobs([]);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = () => {
    // Ensure allJobs is an array before filtering
    let filtered = Array.isArray(allJobs) ? allJobs : [];

    if (searchTerm) {
      filtered = filtered.filter(job =>
        (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.company || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (location && location !== 'All Locations') {
      filtered = filtered.filter(job => (job.location || '').toLowerCase().includes(location.toLowerCase()));
    }


    if (jobType !== 'all') {
      filtered = filtered.filter(job =>
        (job.type || '').toLowerCase().includes(jobType.toLowerCase())
      );
    }

    setJobs(filtered);
  };

  const handleSaveJob = (jobId) => {
    setJobs(jobs.map(job =>
      job.id === jobId ? { ...job, saved: !job.saved } : job
    ));
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowDetailsModal(true);
  };

  const validateApplication = () => {
    const newErrors = {};

    // Cover Letter
    if (!applicationData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (applicationData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters';
    }

    // Expected Salary
    if (!applicationData.expectedSalary.trim()) {
      newErrors.expectedSalary = 'Expected salary is required';
    } else if (!/^\d+(\.\d+)?$/.test(applicationData.expectedSalary.replace(/,/g, ''))) {
      newErrors.expectedSalary = 'Enter a valid salary amount';
    }

    // Availability Date
    if (!applicationData.availability) {
      newErrors.availability = 'Please select your availability date';
    } else {
      const selectedDate = new Date(applicationData.availability);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.availability = 'Date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitApplication = async () => {
    if (!validateApplication()) return;

    setApplying(true);
    setApplyError('');
    try {
      await jobService.applyToJob({
        job_id: selectedJob.source === 'hr_post' ? null : selectedJob.id,
        hr_job_id: selectedJob.source === 'hr_post' ? selectedJob.id : null,
        source: selectedJob.source || 'jobs',
        availability: applicationData.availability,
        cover_letter: applicationData.coverLetter,
      });

      setSuccessMessage(`Application submitted for ${selectedJob.title}!`);
      setShowSuccessModal(true);
      setShowApplyModal(false);
      setApplicationData({ coverLetter: '', expectedSalary: '', availability: '' });
      setErrors({});

      // mark job as applied in list
      setJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, already_applied: true } : j));
      setAllJobs(prev => prev.map(j => j.id === selectedJob.id ? { ...j, already_applied: true } : j));
    } catch (err) {
      setApplyError(err?.message || 'Failed to submit application. Please try again.');
    } finally {
      setApplying(false);
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

        {/* Search & Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-gray-700"
              />
            </div>
            <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-400" />
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-gray-700"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-700 focus:ring-2 focus:ring-emerald-600"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-teal-700 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-teal-800 hover:to-emerald-600 font-medium flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{jobs.length}</span> jobs
          </p>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-emerald-700" />
                </div>
                <button
                  onClick={() => handleSaveJob(job.id)}
                  className={`${job.saved ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                >
                  <Star className={`w-5 h-5 ${job.saved ? 'fill-current' : ''}`} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-4">{job.company}</p>
              <div className="flex items-center space-x-2 text-gray-600 mb-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                  {job.type || 'Full-time'}
                </span>
                <div className="flex items-center space-x-1 text-gray-900 font-semibold text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>{(job.salary || 'Negotiable').split(' - ')[0]}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-1 text-gray-500 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{job.posted}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewDetails(job)}
                    className="text-emerald-700 hover:text-emerald-700 font-medium text-sm px-3 py-1 border border-emerald-700 rounded-lg"
                  >
                    Details
                  </button>
                <button
                    onClick={() => handleApply(job)}
                    disabled={job.already_applied}
                    className={`px-4 py-2 rounded-lg font-medium text-sm ${
                      job.already_applied
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-700 to-emerald-500 text-white hover:from-teal-800 hover:to-emerald-600'
                    }`}
                  >
                    {job.already_applied ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Apply Modal */}
        {showApplyModal && selectedJob && (
          <Modal
            isOpen={showApplyModal}
            onClose={() => setShowApplyModal(false)}
            title={`Apply for ${selectedJob.title}`}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={applicationData.coverLetter}
                  onChange={(e) =>
                    setApplicationData({ ...applicationData, coverLetter: e.target.value })
                  }
                  placeholder="Tell us why you're a great fit for this role..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  rows="6"
                />

                {errors.coverLetter && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.coverLetter}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Salary
                </label>
                <input
                  type="text"
                  value={applicationData.expectedSalary}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      expectedSalary: e.target.value
                    })
                  }
                  placeholder="Rs. 50,000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />

                {errors.expectedSalary && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.expectedSalary}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available to Join
                </label>
                <input
                  type="date"
                  value={applicationData.availability}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      availability: e.target.value
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />

                {errors.availability && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.availability}
                  </p>
                )}
              </div>

              {applyError && (
                <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{applyError}</p>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => { setShowApplyModal(false); setApplyError(''); }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  disabled={applying}
                  className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600 disabled:opacity-60"
                >
                  {applying ? 'Submitting…' : 'Submit Application'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Details Modal */}
        {showDetailsModal && selectedJob && (
          <Modal
            isOpen={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            title={selectedJob.title}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-3">
                  <Building2 className="w-8 h-8 text-emerald-700" />
                  <div>
                    <p className="font-semibold text-gray-900">{selectedJob.company}</p>
                    <p className="text-sm text-gray-600">{selectedJob.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{selectedJob.salary}</p>
                  <p className="text-sm text-gray-600">{selectedJob.type}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                <p className="text-gray-600 whitespace-pre-line">{selectedJob.description || 'No description provided.'}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                <p className="text-gray-600 whitespace-pre-line">{selectedJob.requirements || 'No requirements specified.'}</p>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleSaveJob(selectedJob.id);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Star className="w-4 h-4" />
                  <span>{selectedJob.saved ? 'Unsave' : 'Save Job'}</span>
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleApply(selectedJob);
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600"
                >
                  Apply Now
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
                className="mt-6 px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600"
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

export default BrowseJobs;
