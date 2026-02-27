import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Camera, Upload, CheckCircle } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/useAuth';
import axios from '../../api/axios';

const Profile = () => {
  const { user } = useAuth();

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  // Country codes dropdown
  const countryCodes = ['+91', '+1', '+44', '+61', '+971'];

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    countryCode: '+91',
    phone: '',
    location: '',
    dateOfBirth: '',
    gender: '',
    experience: '',
    specialization: '',
    certifications: '',
    languages: '',
    availability: '',
    expectedSalary: '',
    highestQualification: '',
    additionalQualification: '',
    noticePeriod: '',
    preferredCity: '',
    currentCity: '',
    interestedInTeaching: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 15);
      setFormData((prev) => ({ ...prev, phone: cleaned }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Load profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get('/api/candidate/profile');
        const p = res.data.profile || res.data;
        const raw = p.phone_number || '';
        // Strip country code prefix so only digits remain
        const codeMatch = raw.match(/^(\+\d{1,3})/);
        const code = codeMatch ? codeMatch[1] : '+91';
        const digits = raw.replace(/^\+\d{1,3}/, '');
        setFormData((prev) => ({
          ...prev,
          fullName: p.full_name || prev.fullName,
          email: p.email || prev.email,
          countryCode: code,
          phone: digits,
          location: p.location || '',
          dateOfBirth: p.dob ? p.dob.split('T')[0] : '',
          gender: p.gender || '',
          experience: p.current_experience || '',
          specialization: p.current_position || '',
          certifications: p.certifications || '',
          expectedSalary: p.expected_salary || '',
          highestQualification: p.highest_qualification || '',
          additionalQualification: p.qualification || '',
          preferredCity: p.preferred_location || '',
          interestedInTeaching: p.interested_in_teaching || false,
          availability: p.preferred_job_type || '',
        }));
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    };
    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handlePhotoUpload = () => {
    if (!selectedFile) return;
    console.log('Uploading photo:', selectedFile);
    setSuccessMessage('Profile picture updated successfully!');
    setShowSuccessModal(true);
    setShowPhotoModal(false);
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/candidate/profile', {
        full_name: formData.fullName,
        phone_number: `${formData.countryCode}${formData.phone}`,
        location: formData.location,
        gender: formData.gender,
        dob: formData.dateOfBirth || null,
        qualification: formData.additionalQualification,
        highest_qualification: formData.highestQualification,
        current_experience: formData.experience,
        current_position: formData.specialization,
        expected_salary: formData.expectedSalary,
        preferred_location: formData.preferredCity,
        certifications: formData.certifications,
        interested_in_teaching: formData.interestedInTeaching,
        preferred_job_type: formData.availability,
      });
      setSuccessMessage('Profile updated successfully!');
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Failed to save profile:', err);
      alert(err?.response?.data?.message || 'Failed to save profile. Please try again.');
    }
  };

  return (
    <div>
      <Sidebar />

      <div className="ml-0 md:ml-64 min-h-screen bg-gray-50 p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Profile Picture */}
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>

              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="absolute bottom-0 right-0 bg-white border-2 border-gray-200 rounded-full p-1 sm:p-2 hover:bg-gray-50"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>

            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">{user?.name || 'User'}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{user?.email || 'user@example.com'}</p>
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                className="mt-1 sm:mt-2 text-cyan-600 hover:text-cyan-700 font-medium text-xs sm:text-sm"
              >
                Change Profile Picture
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Personal Info Header */}
              <div className="sm:col-span-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Personal Information
                </h3>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <User className="w-3 h-3 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Mail className="w-3 h-3 inline mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Phone className="w-3 h-3 inline mr-1" />
                  Phone Number
                </label>

                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
                  <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-gray-50 border-r border-gray-200 text-xs sm:text-sm">
                    <Phone className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="bg-transparent outline-none text-gray-700 font-medium cursor-pointer"
                    >
                      {countryCodes.map((code) => (
                        <option key={code} value={code}>{code}</option>
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-2 outline-none text-sm sm:text-base"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 sm:text-sm">
                  Example: {formData.countryCode}9876543210
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <MapPin className="w-3 h-3 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>

              {/* Highest Qualification */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Highest Qualification
                </label>
                <select
                  name="highestQualification"
                  value={formData.highestQualification}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                >
                  <option value="">Select Qualification</option>
                  <option value="MBBS">MBBS</option>
                  <option value="MD">MD</option>
                  <option value="MS">MS</option>
                  <option value="BDS">BDS</option>
                  <option value="MDS">MDS</option>
                  <option value="BHMS">BHMS</option>
                  <option value="BAMS">BAMS</option>
                  <option value="DM">DM</option>
                  <option value="MCh">MCh</option>
                </select>
              </div>

              {/* Additional Qualification */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Additional Qualification
                </label>
                <input
                  type="text"
                  name="additionalQualification"
                  value={formData.additionalQualification}
                  onChange={handleChange}
                  placeholder="Type Your Additional Qualification"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm sm:text-base"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              {/* Professional Info Header */}
              <div className="sm:col-span-2 mt-4 sm:mt-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Professional Information
                </h3>
              </div>

              {/* Experience, Specialization, Certifications, Languages, Availability, etc. */}
              {/* Use same pattern: input/select with text-xs sm:text-sm and px-3 py-2 for mobile */}
              {/* Expected Salary, Notice Period, Preferred City, Current City */}
            </div>

            {/* Checkbox */}
            <div className="sm:col-span-2 flex items-center gap-2 my-4 text-xs sm:text-sm">
              <input
                type="checkbox"
                name="interestedInTeaching"
                checked={formData.interestedInTeaching}
                onChange={handleChange}
                className="h-3 w-3 sm:h-4 sm:w-4"
              />
              <label className="text-gray-700 font-medium">
                Interested in Teaching Positions in Medical Colleges
              </label>
            </div>

            {/* Save / Cancel Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
              <button
                type="button"
                className="px-4 sm:px-6 py-1 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 sm:px-6 py-1 sm:py-2 rounded-lg hover:from-cyan-600 hover:to-blue-700 text-sm sm:text-base"
              >
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Photo Modal */}
        {showPhotoModal && (
          <Modal isOpen={showPhotoModal} onClose={() => setShowPhotoModal(false)} title="Change Profile Picture">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                <p className="text-gray-600 mb-2">Upload a new profile picture</p>
                <p className="text-sm text-gray-500 mb-2">JPG, PNG or GIF, max 5MB</p>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="inline-block bg-gray-100 text-gray-700 px-3 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-gray-200 cursor-pointer text-sm sm:text-base"
                >
                  Choose File
                </label>

                {selectedFile && <p className="mt-2 text-sm text-green-600">Selected: {selectedFile.name}</p>}
              </div>

              <div className="flex justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(false)}
                  className="px-4 sm:px-6 py-1 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handlePhotoUpload}
                  disabled={!selectedFile}
                  className="px-4 sm:px-6 py-1 sm:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Upload Photo
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title="Success">
            <div className="text-center py-4 sm:py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <p className="text-base sm:text-lg text-gray-900">{successMessage}</p>

              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="mt-2 sm:mt-4 px-4 sm:px-6 py-1 sm:py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-600 hover:to-blue-700 text-sm sm:text-base"
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

export default Profile;