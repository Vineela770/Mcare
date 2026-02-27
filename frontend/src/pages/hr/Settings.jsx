import { useState, useEffect } from 'react';
import { Save, Bell, User, Mail } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import employerService from '../../api/employerService';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',

    phoneCountryCode: '+91',
    phone: '',

    alternatePhoneCountryCode: '+91',
    alternatePhone: '',

    location: '',
    pan: '',
    gst: '',
    logo: null,
    coverPhoto: null,
    about: '',
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
          setFormData({
            companyName: data.company_name || '',
            email: data.email || '',
            phoneCountryCode: data.phone_country_code || '+91',
            phone: data.phone || '',
            alternatePhoneCountryCode: data.alternate_phone_country_code || '+91',
            alternatePhone: data.alternate_phone || '',
            location: data.location || '',
            pan: data.pan || '',
            gst: data.gst || '',
            logo: null,
            coverPhoto: null,
            about: data.about || '',
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

    if (!formData.companyName.trim()) newErrors.companyName = 'Organization Name is required';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{6,14}$/.test(formData.phone)) newErrors.phone = 'Enter valid phone number';

    if (formData.alternatePhone && !/^[0-9]{6,14}$/.test(formData.alternatePhone))
      newErrors.alternatePhone = 'Enter valid alternate phone number';

    if (!formData.location.trim()) newErrors.location = 'Location is required';

    if (!formData.about.trim()) newErrors.about = 'About organization is required';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      setLoading(true);
      await employerService.saveProfile(formData);
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Number <span className="text-gray-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="gst"
                  value={formData.gst}
                  onChange={handleChange}
                  placeholder="27ABCDE1234F1Z5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Image *</label>
                <input type="file" name="logo" accept="image/*" onChange={handleChange} className="w-full" />
                {errors.logo && <p className="text-red-500 text-sm mt-1">{errors.logo}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Photo *</label>
                <input type="file" name="coverPhoto" accept="image/*" onChange={handleChange} className="w-full" />
                {errors.coverPhoto && <p className="text-red-500 text-sm mt-1">{errors.coverPhoto}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Brief About Organization *</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your organization (50–200 words)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
                {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
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