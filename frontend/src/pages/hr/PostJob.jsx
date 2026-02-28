import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Clock, Users, Phone, Send, CheckCircle, Type, Building2, IndianRupee, Calendar, ClipboardList, Gift } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';
import { employerService } from '../../api/employerService';

const safeText = (val) => (val && String(val).trim() ? String(val).trim() : '—');

const PostJob = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [postedJob, setPostedJob] = useState(null);

  // ✅ Dropdown data
  const countryCodes = ['+91', '+1', '+44', '+61', '+971'];
  const experienceOptions = [
    'Fresher (0 years)',
    '0 - 1 years',
    '1 - 2 years',
    '2 - 5 years',
    '5 - 10 years',
    '10+ years',
  ];
  const salaryOptions = [
    'Negotiable',
    '₹ 1 - 2 LPA',
    '₹ 2 - 4 LPA',
    '₹ 4 - 6 LPA',
    '₹ 6 - 10 LPA',
    '₹ 10 - 15 LPA',
    '₹ 15 - 25 LPA',
    '₹ 25+ LPA',
    '₹ 30,000 - 50,000 / month',
    '₹ 50,000 - 80,000 / month',
    '₹ 80,000 - 1,20,000 / month',
    '₹ 1,20,000+ / month',
  ];

  const initialForm = {
    title: '',
    department: '',
    location: '',
    jobType: 'full-time',
    experience: '',
    salary: '',
    positions: '',
    description: '',
    requirements: '',
    benefits: '',
    deadline: '',
    countryCode: '+91',
    phone: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 15);
      setFormData((prev) => ({ ...prev, phone: cleaned }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDraft = () => {
    console.log('Job Saved as Draft:', formData);
    setToast({ message: 'Job saved as draft.', type: 'info' });
    setFormData(initialForm);
  };

  const handleReview = () => {
    const ok = formRef.current?.checkValidity();
    if (!ok) {
      formRef.current?.reportValidity();
      return;
    }
    setPreviewData({ ...formData, phone: `${formData.countryCode}${formData.phone}` });
    setShowReviewModal(true);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await employerService.postJob(previewData);
      setShowReviewModal(false);
      setPostedJob(result || previewData);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to post job:', error);
      setShowReviewModal(false);
      setToast({ message: error?.message || 'Failed to post job. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Toast toast={toast} onClose={() => setToast(null)} />
      <Sidebar />

      {/* ✅ Mobile: no left margin + top padding for hamburger
          ✅ Desktop: ml-64 (unchanged) */}
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 pt-16 md:pt-6 md:ml-64">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Post New Job</h1>
          <p className="text-gray-600 mt-2">Create a new job posting to attract candidates</p>
        </div>

        <form
          ref={formRef}
          onSubmit={(e) => e.preventDefault()}
          className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 w-full lg:w-[70%]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Job Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Type className="w-4 h-4 inline mr-1" />
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="e.g., Senior Registered Nurse"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-1" />
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="">Select Department</option>
                <option value="nursing">Nursing</option>
                <option value="medical">Medical</option>
                <option value="surgical">Surgical</option>
                <option value="emergency">Emergency</option>
                <option value="pediatric">Pediatric</option>
                <option value="cardiology">Cardiology</option>
                <option value="radiology">Radiology</option>
                <option value="laboratory">Laboratory</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="e.g., Guntur, Andhra Pradesh"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>

              {/* ✅ Mobile: stack country code + phone (no overflow)
                  ✅ Desktop: keep row layout */}
              <div className="flex flex-col sm:flex-row sm:items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b sm:border-b-0 sm:border-r border-gray-300">
                  <Phone className="text-gray-400 w-5 h-5" />
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer"
                  >
                    {countryCodes.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  inputMode="numeric"
                  className="w-full px-4 py-2 outline-none"
                  required
                />
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Example: {formData.countryCode}9876543210
              </p>
            </div>

            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Briefcase className="w-4 h-4 inline mr-1" />
                Job Type *
              </label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
              </select>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Experience Required *
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="">Select Experience</option>
                {experienceOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <IndianRupee className="w-4 h-4 inline mr-1" />
                Salary Range *
              </label>
              <select
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              >
                <option value="">Select Salary Range</option>
                {salaryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Positions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Number of Positions *
              </label>
              <input
                type="number"
                name="positions"
                value={formData.positions}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="e.g., 3"
                min="1"
                required
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Application Deadline *
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ClipboardList className="w-4 h-4 inline mr-1" />
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Describe the job role, responsibilities, and day-to-day tasks..."
                required
              />
            </div>

            {/* Requirements */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements & Qualifications *
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="List the required qualifications, certifications, and skills..."
                required
              />
            </div>

            {/* Benefits */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Gift className="w-4 h-4 inline mr-1" />
                Benefits & Perks
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="List benefits like health insurance, paid time off, etc..."
              />
            </div>
          </div>

          {/* ✅ Action Buttons responsive:
              Mobile: stack full width
              Desktop: right aligned row (unchanged) */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={handleReview}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium flex items-center justify-center space-x-2"
            >
              <Send className="w-5 h-5" />
              <span>Review</span>
            </button>
          </div>
        </form>

        {/* Review Modal */}
        {showReviewModal && previewData && (
          <Modal
            isOpen={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            title="Review Job Posting"
          >
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Please review the details before submitting.</p>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div><span className="font-medium text-gray-700">Title:</span> {safeText(previewData.title)}</div>
                <div><span className="font-medium text-gray-700">Department:</span> {safeText(previewData.department)}</div>
                <div><span className="font-medium text-gray-700">Location:</span> {safeText(previewData.location)}</div>
                <div><span className="font-medium text-gray-700">Job Type:</span> {safeText(previewData.jobType)}</div>
                <div><span className="font-medium text-gray-700">Experience:</span> {safeText(previewData.experience)}</div>
                <div><span className="font-medium text-gray-700">Salary:</span> {safeText(previewData.salary)}</div>
                <div><span className="font-medium text-gray-700">Positions:</span> {safeText(previewData.positions)}</div>
                <div><span className="font-medium text-gray-700">Deadline:</span> {safeText(previewData.deadline)}</div>
                <div><span className="font-medium text-gray-700">Phone:</span> {safeText(previewData.phone)}</div>
                {previewData.description && (
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>{' '}
                    {previewData.description.slice(0, 120)}{previewData.description.length > 120 ? '…' : ''}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="w-full sm:w-auto px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Edit
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={submitting}
                  className="w-full sm:w-auto px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting…' : 'Submit Job'}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <Modal
            isOpen={showSuccessModal}
            onClose={() => {
              setShowSuccessModal(false);
              navigate('/hr/jobs');
            }}
            title="Job Posted Successfully!"
          >
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900">Job Posting Complete</h3>

              <p className="text-gray-600">
                Your job posting for <span className="font-semibold">{postedJob?.title || formData.title}</span> has been published
                successfully and is now visible to candidates.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 text-left">
                <p className="text-sm text-gray-600 mb-2">Job Details:</p>
                <ul className="space-y-1 text-sm">
                  <li className="text-gray-700">
                    <span className="font-medium">Department:</span> {postedJob?.department || formData.department}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-medium">Location:</span> {postedJob?.location || formData.location}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-medium">Positions:</span> {postedJob?.positions || formData.positions}
                  </li>
                  <li className="text-gray-700">
                    <span className="font-medium">Deadline:</span> {postedJob?.deadline || formData.deadline}
                  </li>
                </ul>
              </div>

              {/* ✅ Modal buttons responsive */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    setFormData(initialForm);
                    setPostedJob(null);
                  }}
                  className="w-full sm:w-auto px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Post Another Job
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/hr/jobs');
                  }}
                  className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700"
                >
                  View My Jobs
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PostJob;