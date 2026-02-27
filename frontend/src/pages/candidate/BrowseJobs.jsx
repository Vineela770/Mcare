import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Clock, Star, X, FileText, Building2, Calendar, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';


const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
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

  const allJobs = [
    {
      id: 1,
      title: 'Senior Registered Nurse - ICU',
      company: 'MCARE Hospital',
      location: 'Guntur, Andhra Pradesh',
      type: 'Full-time',
      salary: 'Rs. 50,000 - 70,000',
      posted: '2 days ago',
      saved: false,
      description: 'We are seeking an experienced ICU nurse to join our critical care team. The ideal candidate will have strong clinical skills and excellent patient care abilities.',
      requirements: ['B.Sc Nursing degree', 'Minimum 3 years ICU experience', 'Valid nursing license', 'BLS and ACLS certification'],
      responsibilities: ['Monitor ICU patients', 'Administer medications', 'Coordinate with doctors', 'Maintain patient records']
    },
    {
      id: 2,
      title: 'Physical Therapist',
      company: 'Apollo Hospitals',
      location: 'Hyderabad, Telangana',
      type: 'Full-time',
      salary: 'Rs. 40,000 - 60,000',
      posted: '1 week ago',
      saved: true,
      description: 'Join our rehabilitation team to help patients recover and improve their mobility through physical therapy treatments.',
      requirements: ['BPT or MPT degree', '2+ years experience', 'Valid license', 'Strong communication skills'],
      responsibilities: ['Assess patient conditions', 'Develop treatment plans', 'Perform therapy sessions', 'Track patient progress']
    },
    {
      id: 3,
      title: 'Lab Technician',
      company: 'City Diagnostics',
      location: 'Vijayawada, Andhra Pradesh',
      type: 'Part-time',
      salary: 'Rs. 25,000 - 35,000',
      posted: '3 days ago',
      saved: false,
      description: 'Seeking skilled lab technician to perform diagnostic tests and maintain laboratory equipment.',
      requirements: ['B.Sc MLT or equivalent', '1+ year experience', 'Knowledge of lab equipment', 'Attention to detail'],
      responsibilities: ['Conduct laboratory tests', 'Maintain equipment', 'Record test results', 'Ensure quality control']
    },
    {
      id: 4,
      title: 'Medical Officer',
      company: 'Care Hospital',
      location: 'Guntur, Andhra Pradesh',
      type: 'Full-time',
      salary: 'Rs. 80,000 - 1,20,000',
      posted: '1 day ago',
      saved: false,
      description: 'Experienced medical officer needed for our emergency department. Must be able to handle critical cases.',
      requirements: ['MBBS degree', 'Valid medical license', '3+ years experience', 'Emergency care expertise'],
      responsibilities: ['Diagnose and treat patients', 'Handle emergency cases', 'Prescribe medications', 'Maintain medical records']
    },
    {
      id: 5,
      title: 'Pharmacist',
      company: 'MedPlus Health Services',
      location: 'Hyderabad, Telangana',
      type: 'Full-time',
      salary: 'Rs. 30,000 - 45,000',
      posted: '5 days ago',
      saved: true,
      description: 'Join our pharmacy team to provide medication counseling and ensure accurate dispensing of prescriptions.',
      requirements: ['B.Pharm or D.Pharm', 'Valid pharmacy license', '2+ years experience', 'Good communication skills'],
      responsibilities: ['Dispense medications', 'Counsel patients', 'Manage inventory', 'Verify prescriptions']
    },
    {
      id: 6,
      title: 'Dental Hygienist',
      company: 'Smile Dental Clinic',
      location: 'Vijayawada, Andhra Pradesh',
      type: 'Part-time',
      salary: 'Rs. 20,000 - 30,000',
      posted: '1 week ago',
      saved: false,
      description: 'Looking for a skilled dental hygienist to provide preventive dental care and patient education.',
      requirements: ['Dental hygiene certification', '1+ year experience', 'Patient care skills', 'Hygiene knowledge'],
      responsibilities: ['Clean teeth', 'Take X-rays', 'Educate patients', 'Assist dentist']
    }
  ];

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
    setJobs(allJobs);
  }, []);

  const handleSearch = () => {
    let filtered = allJobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (location && location !== 'All Locations') {
      filtered = filtered.filter(job => job.location === location);
    }


    if (jobType !== 'all') {
      filtered = filtered.filter(job =>
        job.type.toLowerCase() === jobType.toLowerCase()
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

  const handleSubmitApplication = () => {
    if (!validateApplication()) return;

    console.log('Application submitted:', {
      job: selectedJob,
      application: applicationData
    });

    setSuccessMessage(`Application submitted for ${selectedJob.title}!`);
    setShowSuccessModal(true);
    setShowApplyModal(false);

    setApplicationData({
      coverLetter: '',
      expectedSalary: '',
      availability: ''
    });

    setErrors({});
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
              className="px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-700 focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">All Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium flex items-center justify-center space-x-2"
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
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-cyan-600" />
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
                <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                  {job.type}
                </span>
                <div className="flex items-center space-x-1 text-gray-900 font-semibold text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>{job.salary.split(' - ')[0]}</span>
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
                    className="text-cyan-600 hover:text-cyan-700 font-medium text-sm px-3 py-1 border border-cyan-600 rounded-lg"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => handleApply(job)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium text-sm"
                  >
                    Apply
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />

                {errors.availability && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.availability}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
                >
                  Submit Application
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
                  <Building2 className="w-8 h-8 text-cyan-600" />
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
                <p className="text-gray-600">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedJob.requirements.map((req, index) => (
                    <li key={index} className="text-gray-600">{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1">
                  {selectedJob.responsibilities.map((resp, index) => (
                    <li key={index} className="text-gray-600">{resp}</li>
                  ))}
                </ul>
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
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
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

export default BrowseJobs;
