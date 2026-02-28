import { useState, useEffect } from 'react';
import {
  Upload,
  Download,
  Eye,
  Edit2,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Plus,
  Trash2,
  CheckCircle,
} from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';
import { resumeService } from '../../api/resumeService';
import { userService } from '../../api/userService';

const Resume = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);

  // Load resume data from backend on mount
  useEffect(() => {
    const fetchResumeData = async () => {
      setLoading(true);
      try {
        const data = await resumeService.getUserResume();
        if (data) {
          setSummary(data.summary || '');
          // Ensure experiences and educations are arrays
          setExperiences(Array.isArray(data.experiences) ? data.experiences : []);
          setEducations(Array.isArray(data.educations) ? data.educations : []);
          setProfileCompletion(data.profileCompletion || 0);
          if (data.resumeUrl) {
            setResumeFile({
              name: data.resumeFileName || 'Resume.pdf',
              size: data.resumeSize || 'N/A',
              uploadedDate: data.resumeUploadedDate || new Date().toISOString().split('T')[0],
              url: data.resumeUrl
            });
          }
        }
      } catch (error) {
        console.error('Failed to fetch resume data:', error);
        // Set empty arrays on error
        setExperiences([]);
        setEducations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResumeData();
  }, []);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const [experienceForm, setExperienceForm] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const [educationForm, setEducationForm] = useState({
    degree: '',
    institution: '',
    location: '',
    startYear: '',
    endYear: '',
  });

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUploadResume = () => {
    if (!selectedFile) return;

    setResumeFile({
      name: selectedFile.name,
      size: `${(selectedFile.size / 1024).toFixed(0)} KB`,
      uploadedDate: new Date().toISOString().split('T')[0],
    });

    setShowUploadModal(false);
    setSelectedFile(null);
    showSuccess('Resume uploaded successfully!');
  };

  const handleSaveSummary = () => {
    setShowSummaryModal(false);
    showSuccess('Professional summary updated!');
  };

  const handleAddExperience = () => {
    const newExperience = { id: experiences.length + 1, ...experienceForm };
    setExperiences([...experiences, newExperience]);
    setExperienceForm({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setShowExperienceModal(false);
    showSuccess('Work experience added successfully!');
  };

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp.id !== id));
    showSuccess('Work experience removed!');
  };

  const handleAddEducation = () => {
    const newEducation = { id: educations.length + 1, ...educationForm };
    setEducations([...educations, newEducation]);
    setEducationForm({
      degree: '',
      institution: '',
      location: '',
      startYear: '',
      endYear: '',
    });
    setShowEducationModal(false);
    showSuccess('Education added successfully!');
  };

  const handleDeleteEducation = (id) => {
    setEducations(educations.filter((edu) => edu.id !== id));
    showSuccess('Education removed!');
  };

  const handleDownloadResume = () => {
    showSuccess(`Downloading ${resumeFile.name}...`);
  };

  const handleViewResume = () => setShowViewModal(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* ✅ CONTENT WRAPPER: mobile safe + desktop unchanged */}
      <div className="w-full md:ml-64 p-4 md:p-6">
        {/* ✅ Push down on mobile because hamburger is fixed */}
        <div className="pt-14 md:pt-0">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Resume
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-2">
              Manage your resume and professional profile
            </p>
          </div>

          {/* Profile Completion */}
          <div className="bg-gradient-to-r from-teal-700 to-emerald-500 rounded-xl p-5 md:p-6 mb-6 md:mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white text-lg md:text-xl font-bold mb-1 md:mb-2">
                  Profile Completion
                </h3>
                <p className="text-emerald-100 text-sm md:text-base">
                  Complete your profile to increase visibility
                </p>
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white">
                {profileCompletion}%
              </div>
            </div>
            <div className="w-full bg-emerald-700 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resume + sections */}
            <div className="lg:col-span-2 space-y-6">
              {/* Resume Document */}
              <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-5 md:mb-6">
                  Resume Document
                </h2>

                {resumeFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                            {resumeFile.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600">
                            {resumeFile.size} • Uploaded {resumeFile.uploadedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={handleViewResume}
                          className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          aria-label="View resume"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleDownloadResume}
                          className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-lg"
                          aria-label="Download resume"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="w-full py-2 text-emerald-700 hover:bg-emerald-50 rounded-lg font-medium flex items-center justify-center space-x-2"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Replace Resume</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 md:p-12 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                      Upload Your Resume
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 mb-4">
                      PDF, DOC, or DOCX (Max 5MB)
                    </p>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="bg-gradient-to-r from-teal-700 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-teal-800 hover:to-emerald-600 font-medium"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>

              {/* Professional Summary */}
              <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    Professional Summary
                  </h2>
                  <button
                    onClick={() => setShowSummaryModal(true)}
                    className="text-emerald-700 hover:text-emerald-700"
                    aria-label="Edit summary"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {summary}
                </p>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    Work Experience
                  </h2>
                  <button
                    onClick={() => setShowExperienceModal(true)}
                    className="text-emerald-700 hover:text-emerald-700 font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-emerald-600 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm md:text-base">
                            {exp.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{exp.company}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="text-red-600 hover:text-red-700"
                          aria-label="Delete experience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 mb-2">
                        {exp.startDate} - {exp.endDate} • {exp.location}
                      </p>
                      <p className="text-gray-700 text-xs md:text-sm">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">
                    Education
                  </h2>
                  <button
                    onClick={() => setShowEducationModal(true)}
                    className="text-emerald-700 hover:text-emerald-700 font-medium flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Education</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {educations.map((edu) => (
                    <div key={edu.id} className="border-l-2 border-teal-600 pl-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm md:text-base">
                            {edu.degree}
                          </h3>
                          <p className="text-gray-600 text-sm">{edu.institution}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteEducation(edu.id)}
                          className="text-red-600 hover:text-red-700"
                          aria-label="Delete education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500">
                        {edu.startYear} - {edu.endYear} • {edu.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100">
                <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowExperienceModal(true)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 text-sm md:text-base">
                        Work Experience
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        Add or edit
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowEducationModal(true)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-teal-700" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 text-sm md:text-base">
                        Education
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        Add or edit
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setShowSummaryModal(true)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900 text-sm md:text-base">
                        Summary
                      </div>
                      <div className="text-xs md:text-sm text-gray-500">
                        Edit profile
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

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

          {/* View Resume Modal */}
          {showViewModal && (
            <Modal
              isOpen={showViewModal}
              onClose={() => setShowViewModal(false)}
              title="Resume Preview"
            >
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6 md:p-8 text-center">
                  <FileText className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {resumeFile.name}
                  </h3>
                  <p className="text-gray-600 mb-4">Preview your resume document</p>
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-8 md:p-12 mb-4">
                    <p className="text-gray-500 italic">
                      Resume content would be displayed here
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      handleDownloadResume();
                      setShowViewModal(false);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600 flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* Upload Modal */}
          {showUploadModal && (
            <Modal
              isOpen={showUploadModal}
              onClose={() => setShowUploadModal(false)}
              title="Upload Resume"
            >
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Choose a file to upload</p>
                  <p className="text-sm text-gray-500 mb-4">
                    PDF, DOC, or DOCX (Max 5MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 cursor-pointer"
                  >
                    Choose File
                  </label>
                  {selectedFile && (
                    <p className="mt-3 text-sm text-green-600">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadResume}
                    disabled={!selectedFile}
                    className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* Summary Edit Modal */}
          {showSummaryModal && (
            <Modal
              isOpen={showSummaryModal}
              onClose={() => setShowSummaryModal(false)}
              title="Edit Professional Summary"
            >
              <div className="space-y-4">
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  placeholder="Describe your professional background and expertise..."
                />
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowSummaryModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSummary}
                    className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* Experience Modal */}
          {showExperienceModal && (
            <Modal
              isOpen={showExperienceModal}
              onClose={() => setShowExperienceModal(false)}
              title="Add Work Experience"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={experienceForm.title}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    placeholder="e.g., Senior Registered Nurse"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={experienceForm.company}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, company: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    placeholder="e.g., Manhattan Hospital"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={experienceForm.location}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, location: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    placeholder="e.g., New York, NY"
                  />
                </div>

                {/* ✅ Mobile safe dates: 1 col on mobile, 2 col on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="text"
                      value={experienceForm.startDate}
                      onChange={(e) =>
                        setExperienceForm({ ...experienceForm, startDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      placeholder="e.g., 2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="text"
                      value={experienceForm.endDate}
                      onChange={(e) =>
                        setExperienceForm({ ...experienceForm, endDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      placeholder="e.g., Present"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={experienceForm.description}
                    onChange={(e) =>
                      setExperienceForm({ ...experienceForm, description: e.target.value })
                    }
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowExperienceModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddExperience}
                    className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600"
                  >
                    Add Experience
                  </button>
                </div>
              </div>
            </Modal>
          )}

          {/* Education Modal */}
          {showEducationModal && (
            <Modal
              isOpen={showEducationModal}
              onClose={() => setShowEducationModal(false)}
              title="Add Education"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={educationForm.degree}
                    onChange={(e) =>
                      setEducationForm({ ...educationForm, degree: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    placeholder="e.g., Bachelor of Science in Nursing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={educationForm.institution}
                    onChange={(e) =>
                      setEducationForm({
                        ...educationForm,
                        institution: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    placeholder="e.g., Columbia University"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={educationForm.location}
                    onChange={(e) =>
                      setEducationForm({ ...educationForm, location: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                    placeholder="e.g., New York, NY"
                  />
                </div>

                {/* ✅ Mobile safe years */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Year
                    </label>
                    <input
                      type="text"
                      value={educationForm.startYear}
                      onChange={(e) =>
                        setEducationForm({ ...educationForm, startYear: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      placeholder="e.g., 2016"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Year
                    </label>
                    <input
                      type="text"
                      value={educationForm.endYear}
                      onChange={(e) =>
                        setEducationForm({ ...educationForm, endYear: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                      placeholder="e.g., 2020"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    onClick={() => setShowEducationModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddEducation}
                    className="px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-500 text-white rounded-lg hover:from-teal-800 hover:to-emerald-600"
                  >
                    Add Education
                  </button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resume;