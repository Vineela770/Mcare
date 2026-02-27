import { useState, useEffect } from 'react';
import { Save, Bell, User, Mail } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import employerService from '../../api/employerService';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    full_name: '',
    organization_name: '',
    email: '',
    phoneCountryCode: '+91',
    phone: '',
    alternatePhoneCountryCode: '+91',
    alternatePhone: '',
    designation: '',
    category: '',
    numberOfBeds: '',
    organization_city: '',
    organization_address: '',
    website: '',
    description: '',
    notifications: {
      emailAlerts: true,
      applicationUpdates: true,
      interviewReminders: true,
      weeklyReports: false,
    },
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await employerService.getProfile();
        if (data) {
          const raw = data.phone_number || '';
          const codeMatch = raw.match(/^(\+\d{1,3})/);
          const code = codeMatch ? codeMatch[1] : '+91';
          const digits = raw.replace(/^\+\d{1,3}/, '');
          setFormData({
            full_name: data.full_name || '',
            organization_name: data.organization_name || '',
            email: data.email || '',
            phoneCountryCode: code,
            phone: digits,
            alternatePhoneCountryCode: '+91',
            alternatePhone: '',
            designation: data.designation || '',
            category: data.organization_category || '',
            numberOfBeds: data.number_of_beds || '',
            organization_city: data.organization_city || '',
            organization_address: data.organization_address || '',
            website: data.website_url || '',
            description: data.description || '',
            notifications: {
              emailAlerts: data.email_alerts !== false,
              applicationUpdates: data.application_updates !== false,
              interviewReminders: data.interview_reminders !== false,
              weeklyReports: data.weekly_reports === true,
            },
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const countryCodes = [
    { code: '+91', label: '🇮🇳 India (+91)' },
    { code: '+1', label: '🇺🇸 USA (+1)' },
    { code: '+44', label: '🇬🇧 UK (+44)' },
    { code: '+971', label: '🇦🇪 UAE (+971)' },
    { code: '+61', label: '🇦🇺 Australia (+61)' },
  ];

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        notifications: { ...prev.notifications, [name]: checked },
      }));
    } else if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.organization_name.trim()) newErrors.organization_name = 'Organization Name is required';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{6,14}$/.test(formData.phone)) newErrors.phone = 'Enter valid phone number';

    if (formData.alternatePhone && !/^[0-9]{6,14}$/.test(formData.alternatePhone))
      newErrors.alternatePhone = 'Enter valid alternate phone number';

    if (!formData.organization_city.trim()) newErrors.organization_city = 'Location is required';

    if (!formData.description.trim()) newErrors.description = 'About organization is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await employerService.saveProfile({
        full_name: formData.full_name,
        phone_number: `${formData.phoneCountryCode}${formData.phone}`,
        designation: formData.designation,
        organization_name: formData.organization_name,
        organization_category: formData.category,
        number_of_beds: formData.numberOfBeds || null,
        organization_city: formData.organization_city,
        organization_address: formData.organization_address,
        website_url: formData.website,
        description: formData.description,
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Sidebar />

      {/* ✅ Mobile: no left margin + add top padding for hamburger
          ✅ Desktop: keep ml-64 unchanged */}
      <div className="min-h-screen bg-gray-50 px-4 sm:px-6 py-6 pt-16 md:pt-6 md:ml-64">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Account Information */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-6 h-6 text-cyan-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Account Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                <input
                  type="text"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                {errors.organization_name && <p className="text-red-500 text-sm mt-1">{errors.organization_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>

                {/* ✅ Mobile: stack select + input to avoid overflow
                    ✅ Desktop: stays in one row */}
                <div className="flex flex-col sm:flex-row">
                  <select
                    name="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-gray-50 focus:ring-2 focus:ring-cyan-500"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg sm:rounded-r-lg sm:rounded-l-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mt-2 sm:mt-0"
                  />
                </div>

                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Alternate Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alternate Phone (Optional)</label>

                <div className="flex flex-col sm:flex-row">
                  <select
                    name="alternatePhoneCountryCode"
                    value={formData.alternatePhoneCountryCode}
                    onChange={handleChange}
                    className="px-3 py-2 border border-gray-300 rounded-lg sm:rounded-l-lg sm:rounded-r-none bg-gray-50 focus:ring-2 focus:ring-cyan-500"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    placeholder="Enter alternate number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg sm:rounded-r-lg sm:rounded-l-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent mt-2 sm:mt-0"
                  />
                </div>

                {errors.alternatePhone && <p className="text-red-500 text-sm mt-1">{errors.alternatePhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City / Location *</label>
                <input
                  type="text"
                  name="organization_city"
                  value={formData.organization_city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                {errors.organization_city && <p className="text-red-500 text-sm mt-1">{errors.organization_city}</p>}
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-6 h-6 text-cyan-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(formData.notifications).map(([key, value]) => (
                <label
                  key={key}
                  className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  <span className="text-gray-700 font-medium text-sm sm:text-base">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <input
                    type="checkbox"
                    name={key}
                    checked={value}
                    onChange={handleChange}
                    className="w-5 h-5 text-cyan-600 focus:ring-cyan-500 rounded"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Organization Details */}
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Organization Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. HR Manager, Medical Director"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Select Category</option>
                  <option value="Hospital">Hospital</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Diagnostic Lab">Diagnostic Lab</option>
                  <option value="Pharmacy">Pharmacy</option>
                  <option value="Nursing Home">Nursing Home</option>
                  <option value="Medical College">Medical College</option>
                  <option value="Research Institute">Research Institute</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Beds</label>
                <input
                  type="number"
                  name="numberOfBeds"
                  value={formData.numberOfBeds}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourhospital.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Address</label>
                <input
                  type="text"
                  name="organization_address"
                  value={formData.organization_address}
                  onChange={handleChange}
                  placeholder="Street, Area, Pin code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">About Organization *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your organization (50–200 words)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 sm:px-8 py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;