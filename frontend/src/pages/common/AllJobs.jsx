import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Star,
  Filter,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useLocation as useRouterLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Modal from '../../components/common/Modal';
import { jobService } from '../../api/jobService';

const AllJobs = () => {
  // ✅ URL params support (Browse Jobs -> show particular job)
  const routerLocation = useRouterLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [jobType, setJobType] = useState('all');

  const [selectedJob, setSelectedJob] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ✅ More Filters modal state
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // ✅ More Filters values
  const [moreFilters, setMoreFilters] = useState({
    postedWithin: 'any', // any | 1 | 3 | 7 | 14
    minSalary: '', // number text
    maxSalary: '', // number text
    onlySaved: false,
  });

  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: '',
  });

  const [errors, setErrors] = useState({});

  // ✅ jobs in state (so we can toggle saved)
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const jobsData = await jobService.getJobs();
        // Ensure jobsData is an array
        const jobsArray = Array.isArray(jobsData) ? jobsData : [];
        setJobs(jobsArray);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);


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
    'Guntur',
    'Vijayawada',
    'Secunderabad',
  ];

  // ✅ Load More state
  const JOBS_PER_PAGE = 6;
  const [visibleCount, setVisibleCount] = useState(JOBS_PER_PAGE);

  // ---------- helpers ----------
  const normalize = useCallback((v = '') => String(v).toLowerCase().trim(), []);

  const parseSalaryRange = useCallback((salaryStr = '') => {
    const cleaned = salaryStr.replace(/₹|Rs\.?/gi, '').replace(/\s/g, '');
    const parts = cleaned.split('-').map((p) => p.replace(/,/g, ''));
    const min = Number(parts?.[0] || 0);
    const max = Number(parts?.[1] || parts?.[0] || 0);
    return { min: isNaN(min) ? 0 : min, max: isNaN(max) ? 0 : max };
  }, []);

  const parsePostedDays = useCallback((postedStr = '') => {
    const s = String(postedStr).toLowerCase().trim();
    const num = Number(s.match(/\d+/)?.[0] ?? '0');
    if (s.includes('week')) return num * 7;
    if (s.includes('day')) return num;
    return 9999;
  }, []);

  // ✅ IMPORTANT FIX:
  // When user clicks "Browse Jobs" from Home, your Home page usually navigates like:
  // /jobs?search=Cardiologist   or   /jobs?search=Neurologist&location=Hyderabad
  // This useEffect reads URL params and applies them so ONLY that job shows.
  useEffect(() => {
    const params = new URLSearchParams(routerLocation.search);

    const qSearch = params.get('search') || params.get('q') || '';
    const qLocation = params.get('location') || params.get('city') || '';
    const qType = params.get('type') || params.get('jobType') || '';
    const qSaved = params.get('saved'); // "1" or "true"
    const qPostedWithin = params.get('postedWithin'); // 1/3/7/14
    const qMinSalary = params.get('minSalary');
    const qMaxSalary = params.get('maxSalary');
    const qJobId = params.get('jobId'); // optional: open details directly

    // ✅ Apply only if param exists (so manual typing in filters won't be overwritten)
    if (qSearch) setSearchTerm(qSearch);
    if (qLocation) setSelectedLocation(qLocation);
    if (qType) setJobType(qType);

    if (qSaved != null || qPostedWithin || qMinSalary || qMaxSalary) {
      setMoreFilters((p) => ({
        ...p,
        onlySaved:
          qSaved == null ? p.onlySaved : qSaved === '1' || qSaved === 'true' || qSaved === 'yes',
        postedWithin: qPostedWithin || p.postedWithin,
        minSalary: qMinSalary ?? p.minSalary,
        maxSalary: qMaxSalary ?? p.maxSalary,
      }));
    }

    // ✅ If you pass jobId from Browse Jobs, open that job directly
    if (qJobId) {
      const id = Number(qJobId);
      const job = jobs.find((j) => j.id === id);
      if (job) {
        setSelectedJob(job);
        setShowDetailsModal(true);
      }
    }

    // ✅ reset pagination whenever route changes (like browse jobs click)
    setVisibleCount(JOBS_PER_PAGE);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLocation.search]);

  // ✅ STAR FIX: toggle saved for a job
  const toggleSaveJob = (jobId) => {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, saved: !j.saved } : j)));
  };

  // ✅ filtering
  const filteredJobs = useMemo(() => {
    // Ensure jobs is an array before filtering
    if (!Array.isArray(jobs)) return [];

    const term = normalize(searchTerm);

    const cityVal = normalize(selectedLocation);
    const cityActive = cityVal && cityVal !== normalize('All Locations') && cityVal !== '';

    const typeActive = normalize(jobType) !== 'all';

    const minSalaryFilter = moreFilters.minSalary ? Number(moreFilters.minSalary) : null;
    const maxSalaryFilter = moreFilters.maxSalary ? Number(moreFilters.maxSalary) : null;
    const postedWithinDays =
      moreFilters.postedWithin === 'any' ? null : Number(moreFilters.postedWithin);

    return jobs.filter((job) => {
      if (term) {
        const blob = `${job.title} ${job.company_name || job.company} ${job.location || job.city}`.toLowerCase();
        if (!blob.includes(term)) return false;
      }

      if (cityActive) {
        if (!normalize(job.location || job.city || '').includes(cityVal)) return false;
      }

      if (typeActive) {
        if (normalize(job.type || job.job_type || '') !== normalize(jobType)) return false;
      }

      if (moreFilters.onlySaved && !job.saved) return false;

      if (postedWithinDays != null) {
        const days = parsePostedDays(job.posted || job.posted_at || '');
        if (days > postedWithinDays) return false;
      }

      if (minSalaryFilter != null || maxSalaryFilter != null) {
        const { min, max } = parseSalaryRange(job.salary || job.salary_range || '');
        if (minSalaryFilter != null && max < minSalaryFilter) return false;
        if (maxSalaryFilter != null && min > maxSalaryFilter) return false;
      }

      return true;
    });
  }, [jobs, searchTerm, selectedLocation, jobType, moreFilters, normalize, parseSalaryRange, parsePostedDays]);

  // ✅ Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(JOBS_PER_PAGE);
  }, [
    searchTerm,
    selectedLocation,
    jobType,
    moreFilters.postedWithin,
    moreFilters.minSalary,
    moreFilters.maxSalary,
    moreFilters.onlySaved,
  ]);

  // ✅ Paginated jobs to show
  const paginatedJobs = useMemo(
    () => filteredJobs.slice(0, visibleCount),
    [filteredJobs, visibleCount]
  );

  const canLoadMore = visibleCount < filteredJobs.length;

  const validateApplication = () => {
    const newErrors = {};

    if (!applicationData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (applicationData.coverLetter.trim().length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters';
    }

    const salary = applicationData.expectedSalary.replace(/[₹Rs.,\s]/g, '');
    if (!salary) {
      newErrors.expectedSalary = 'Expected salary is required';
    } else if (isNaN(salary) || Number(salary) <= 0) {
      newErrors.expectedSalary = 'Enter a valid salary amount';
    }

    if (!applicationData.availability) {
      newErrors.availability = 'Please select a date';
    } else {
      const selectedDate = new Date(applicationData.availability);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.availability = 'Date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitApplication = () => {
    if (!validateApplication()) return;

    setShowApplyModal(false);
    setShowSuccessModal(true);

    setApplicationData({
      coverLetter: '',
      expectedSalary: '',
      availability: '',
    });

    setErrors({});
  };

  const resetMoreFilters = () => {
    setMoreFilters({
      postedWithin: 'any',
      minSalary: '',
      maxSalary: '',
      onlySaved: false,
    });
  };

  const activeMoreFiltersCount = useMemo(() => {
    let c = 0;
    if (moreFilters.postedWithin !== 'any') c += 1;
    if (moreFilters.minSalary) c += 1;
    if (moreFilters.maxSalary) c += 1;
    if (moreFilters.onlySaved) c += 1;
    return c;
  }, [moreFilters]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Search Section */}
      <section className="bg-gradient-to-r from-cyan-500 to-blue-600 py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* ✅ Mobile-only smaller heading + description (desktop unchanged) */}
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-6">
            Find Your Perfect Healthcare Job
          </h1>
          <p className="text-sm md:text-lg text-cyan-100 mb-6 md:mb-8">
            Browse {jobs.length} open positions from top healthcare facilities
          </p>

          <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">
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
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-gray-700"
                >
                  {cities.map((city, index) => (
                    <option key={index} value={city}>
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
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 380, behavior: 'smooth' })}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Positions</h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing <span className="font-semibold">{paginatedJobs.length}</span> of{' '}
                <span className="font-semibold">{filteredJobs.length}</span> jobs
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowFiltersModal(true)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 relative"
            >
              <Filter className="w-5 h-5" />
              <span>More Filters</span>

              {activeMoreFiltersCount > 0 && (
                <span className="ml-2 text-xs bg-cyan-600 text-white px-2 py-0.5 rounded-full">
                  {activeMoreFiltersCount}
                </span>
              )}
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
              <p className="text-lg font-semibold text-gray-900">No jobs found</p>
              <p className="text-gray-600 mt-2">Try clearing filters or changing keywords.</p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLocation('');
                    setJobType('all');
                    resetMoreFilters();
                  }}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={() => setShowFiltersModal(true)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Edit More Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-cyan-600" />
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSaveJob(job.id)}
                      className={`${
                        job.saved ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400`}
                      title={job.saved ? 'Saved' : 'Save job'}
                      aria-label={job.saved ? 'Unsave job' : 'Save job'}
                    >
                      <Star className="w-5 h-5" fill={job.saved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>

                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{job.company}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{job.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                      {job.type}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-600 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary.split(' - ')[0]}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{job.posted}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowDetailsModal(true);
                      }}
                      className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredJobs.length > 0 && (
            <div className="text-center mt-12">
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((v) => Math.min(v + JOBS_PER_PAGE, filteredJobs.length))
                }
                disabled={!canLoadMore}
                className={`bg-white border-2 px-8 py-3 rounded-lg font-medium transition ${
                  canLoadMore
                    ? 'border-cyan-500 text-cyan-600 hover:bg-cyan-50'
                    : 'border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canLoadMore ? 'Load More Jobs' : 'No More Jobs'}
              </button>

              <p className="text-xs text-gray-500 mt-3">
                Showing {paginatedJobs.length} of {filteredJobs.length} results
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ✅ More Filters Modal */}
      {showFiltersModal && (
        <Modal
          isOpen={showFiltersModal}
          onClose={() => setShowFiltersModal(false)}
          title="More Filters"
        >
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Posted within</label>
              <select
                value={moreFilters.postedWithin}
                onChange={(e) => setMoreFilters((p) => ({ ...p, postedWithin: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              >
                <option value="any">Any time</option>
                <option value="1">Last 1 day</option>
                <option value="3">Last 3 days</option>
                <option value="7">Last 7 days</option>
                <option value="14">Last 14 days</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Salary range (monthly)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Min (e.g. 30000)"
                  value={moreFilters.minSalary}
                  onChange={(e) => setMoreFilters((p) => ({ ...p, minSalary: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Max (e.g. 80000)"
                  value={moreFilters.maxSalary}
                  onChange={(e) => setMoreFilters((p) => ({ ...p, maxSalary: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tip: Salary is matched against the job’s salary range.
              </p>
            </div>

            <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div>
                <p className="font-medium text-gray-800">Show saved jobs only</p>
                <p className="text-sm text-gray-500">Filter results to saved jobs</p>
              </div>
              <button
                type="button"
                onClick={() => setMoreFilters((p) => ({ ...p, onlySaved: !p.onlySaved }))}
                className={`w-12 h-7 rounded-full relative transition ${
                  moreFilters.onlySaved ? 'bg-cyan-600' : 'bg-gray-300'
                }`}
                aria-label="Toggle saved jobs only"
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition ${
                    moreFilters.onlySaved ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                type="button"
                onClick={resetMoreFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Reset
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFiltersModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowFiltersModal(false)}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
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
              <p className="text-gray-600 whitespace-pre-line">{selectedJob.description || 'No description provided.'}</p>
            </div>

            {selectedJob.requirements && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
                <p className="text-gray-600 whitespace-pre-line">{selectedJob.requirements}</p>
              </div>
            )}

            {selectedJob.benefits && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Benefits</h3>
                <p className="text-gray-600 whitespace-pre-line">{selectedJob.benefits}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowApplyModal(true);
                }}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
              >
                Apply Now
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <Modal
          isOpen={showApplyModal}
          onClose={() => setShowApplyModal(false)}
          title={`Apply for ${selectedJob.title}`}
        >
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Cover Letter</label>
              <textarea
                rows="5"
                value={applicationData.coverLetter}
                onChange={(e) =>
                  setApplicationData({ ...applicationData, coverLetter: e.target.value })
                }
                placeholder="Tell us why you're a great fit for this role..."
                className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${
                  errors.coverLetter ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.coverLetter && (
                <p className="text-red-500 text-sm mt-1">{errors.coverLetter}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Expected Salary</label>
              <input
                type="text"
                value={applicationData.expectedSalary}
                onChange={(e) =>
                  setApplicationData({ ...applicationData, expectedSalary: e.target.value })
                }
                placeholder="Rs. 50,000"
                className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${
                  errors.expectedSalary ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expectedSalary && (
                <p className="text-red-500 text-sm mt-1">{errors.expectedSalary}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-2">Available to join</label>
              <input
                type="date"
                value={applicationData.availability}
                onChange={(e) =>
                  setApplicationData({ ...applicationData, availability: e.target.value })
                }
                className={`w-full border rounded-lg p-3 focus:ring-2 outline-none ${
                  errors.availability ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.availability && (
                <p className="text-red-500 text-sm mt-1">{errors.availability}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
              >
                Submit Application
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Success Modal */}
      {showSuccessModal && selectedJob && (
        <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Success">
          <div className="flex flex-col items-center text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <p className="text-lg text-gray-800">
              Application submitted for <span className="font-semibold">{selectedJob.title}</span>!
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AllJobs;