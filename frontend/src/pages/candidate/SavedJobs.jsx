import { useState, useEffect } from 'react';
import { Heart, MapPin, Briefcase, Clock, Trash2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';
import { jobService } from '../../api/jobService';

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        const data = await jobService.getSavedJobs();
        // Ensure data is an array
        const jobsArray = Array.isArray(data) ? data : [];
        setSavedJobs(jobsArray);
      } catch (error) {
        console.error('Failed to fetch saved jobs:', error);
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, []);

  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: '',
  });

  const handleRemoveClick = (job) => {
    setSelectedJob(job);
    setShowRemoveModal(true);
  };

  const handleConfirmRemove = () => {
    // Ensure savedJobs is an array
    const jobsArray = Array.isArray(savedJobs) ? savedJobs : [];
    setSavedJobs(jobsArray.filter((job) => job.id !== selectedJob.id));
    setShowRemoveModal(false);
    setSelectedJob(null);
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  const handleSubmitApplication = () => {
    setSuccessMessage(`Application submitted for ${selectedJob.title}!`);
    setShowSuccessModal(true);
    setShowApplyModal(false);
    setApplicationData({ coverLetter: '', expectedSalary: '', availability: '' });
    setSelectedJob(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 md:ml-64 p-4 sm:p-6">
        <div className="mb-6 sm:mb-8 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-1 sm:mt-2">{savedJobs.length} jobs saved for later</p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-sm border border-gray-100">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">No Saved Jobs</h2>
            <p className="text-gray-600 mb-6">Start saving jobs you're interested in</p>
            <Link
              to="/candidate/browse-jobs"
              className="inline-block bg-gradient-to-r from-teal-700 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-teal-800 hover:to-emerald-600 font-medium"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md border border-gray-100 flex flex-col sm:flex-row justify-between gap-4 sm:gap-6"
              >
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" /> {job.type}
                    </div>
                    <div className="flex items-center gap-1">{job.salary}</div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {job.posted}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">

                {/* Apply Button */}
                <button
                  onClick={() => handleApplyClick(job)}
                  className="bg-gradient-to-r from-teal-700 to-emerald-500 text-white
                    px-3 py-1.5 text-sm rounded-md
                    hover:from-teal-800 hover:to-emerald-600 font-medium
                    transition"
                >
                  Apply Now
                </button>

                {/* View Details Button */}
                <Link
                  to={`/candidate/job/${job.id}`}
                  className="border border-emerald-700 text-emerald-700
                    px-3 py-1.5 text-sm rounded-md
                    hover:bg-emerald-50 font-medium
                    transition"
                >
                  View Details
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveClick(job)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700
                    font-medium px-2 py-1.5 text-sm rounded-md transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>

              </div>
              </div>
            ))}
          </div>
        )}

        {showRemoveModal && selectedJob && (
          <Modal isOpen={showRemoveModal} onClose={() => setShowRemoveModal(false)} title="Remove Saved Job">
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to remove <span className="font-semibold">{selectedJob.title}</span> at{' '}
                {selectedJob.company}?
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                <button
                  onClick={() => setShowRemoveModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRemove}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full sm:w-auto"
                >
                  Remove
                </button>
              </div>
            </div>
          </Modal>
        )}

        {showApplyModal && selectedJob && (
          <Modal isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} title={`Apply for ${selectedJob.title}`}>
            <div className="space-y-4">
              <textarea placeholder="Cover Letter" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              <input type="text" placeholder="Expected Salary" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
              <input type="date" className="w-full px-4 py-3 border border-gray-300 rounded-lg" />

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitApplication}
                  className="px-4 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg w-full sm:w-auto"
                >
                  Submit Application
                </button>
              </div>
            </div>
          </Modal>
        )}

        {showSuccessModal && (
          <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Success">
            <div className="text-center py-6">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <p>{successMessage}</p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="mt-4 px-4 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg"
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

export default SavedJobs;