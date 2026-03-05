import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, UserPlus, Calendar, Building2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { authService } from '../../api/authService';
import CustomDropdown from '../../components/common/CustomDropdown';

// Indian cities for interested cities multi-select
const INDIAN_CITIES = [
  'Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi', 'Kolkata', 'Pune', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Chandigarh', 'Bhopal', 'Indore', 'Nagpur', 'Visakhapatnam',
  'Coimbatore', 'Kochi', 'Gurgaon', 'Noida', 'Thiruvananthapuram', 'Mangalore',
  'Mysore', 'Vijayawada', 'Tirupati', 'Warangal', 'Guntur', 'Nellore', 'Madurai',
  'Patna', 'Ranchi', 'Guwahati', 'Dehradun', 'Surat', 'Vadodara', 'Rajkot'
];

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromState = location.state || {};
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    city: '',
    state: '',
    qualification: '',
    designation: '',
    resume: null,
    password: '',
    confirmPassword: '',
    role: '',
    agreeTerms: false,

    // Doctor/Seeker specific
    joinType: '',        // 'immediate' or 'specific'
    joinDate: '',
    interestedCities: [], // up to 3

    // Employer – Organization Info
    organizationName: '',
    organizationCategory: '',
    numberOfBeds: '',
    organizationCity: '',
    organizationAddress: '',
    hiringType: '',      // 'immediate' or 'specific'
    hiringDate: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [policyType, setPolicyType] = useState('terms'); // 'terms' | 'privacy'
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Country code dropdown (sorted by common usage)
  const [countryCode, setCountryCode] = useState('+91');
  const countryCodes = ['+91', '+1', '+44', '+61', '+65', '+971', '+966', '+974', '+968', '+973', '+86', '+81', '+82', '+49', '+33', '+39', '+7', '+55', '+27', '+234', '+254', '+880', '+92', '+94', '+977'];

  // ✅ FIX: handles text/select, checkbox, file, phone digits
  // ✅ FIX: confirmPassword disable + auto-clear when password changes/clears
  const handleChange = (e) => {
    const { name, type, value, checked, files } = e.target;

    // checkbox
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    // file input
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, [name]: files?.[0] || null }));
      return;
    }

    // phone: only digits (allow up to 15 digits for intl)
    const cleanedValue =
      name === 'phone' ? value.replace(/\D/g, '').slice(0, 15) : value;

    setFormData((prev) => {
      // ✅ If Email changes, clear Confirm Email
      if (name === 'email') {
        return {
          ...prev,
          email: cleanedValue,
          confirmEmail: '',
        };
      }

      // ✅ If Password changes/clears, clear Confirm Password automatically
      if (name === 'password') {
        // also hide confirm password view if password changes
        setShowConfirmPassword(false);

        return {
          ...prev,
          password: cleanedValue,
          confirmPassword: '', // ✅ auto clear
        };
      }

      return {
        ...prev,
        [name]: cleanedValue,
        ...(name === 'role' && { qualification: '', designation: '', joinType: '', joinDate: '', interestedCities: [], hiringType: '', hiringDate: '' }),
      };
    });

    // optional: clear error as user types
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ✅ Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address (e.g. name@example.com)');
      return;
    }

    if (formData.email !== formData.confirmEmail) {
      setError('Email addresses do not match');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // ✅ Password strength validation (matches backend requirements)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain uppercase, lowercase, number, and special character (@$!%*?&)');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    // ✅ phone basic validation (international)
    if (!formData.phone || formData.phone.length < 7) {
      setError('Please enter a valid phone number');
      return;
    }

    // ✅ City & State mandatory
    if (!formData.city.trim()) {
      setError('City is required');
      return;
    }
    if (!formData.state.trim()) {
      setError('State is required');
      return;
    }

    setLoading(true);

    try {
      // ✅ Prepare FormData for multipart/form-data (for resume upload)
      const submitData = new FormData();
      
      // Add all text fields
      submitData.append('title', formData.title);
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('phone', `${countryCode}${formData.phone}`);
      submitData.append('location', `${formData.city}, ${formData.state}`);
      submitData.append('role', formData.role);
      
      // Role-specific fields
      if (formData.role === 'candidate') {
        submitData.append('qualification', formData.qualification);
        submitData.append('designation', formData.designation);
        submitData.append('joinType', formData.joinType);
        if (formData.joinType === 'specific') {
          submitData.append('joinDate', formData.joinDate);
        }
        if (formData.interestedCities.length > 0) {
          submitData.append('interestedCities', JSON.stringify(formData.interestedCities));
        }
        if (formData.resume) {
          submitData.append('resume', formData.resume);
        }
      } else if (formData.role === 'hr') {
        submitData.append('organizationName', formData.organizationName);
        submitData.append('organizationCategory', formData.organizationCategory);
        submitData.append('numberOfBeds', formData.numberOfBeds);
        submitData.append('organizationCity', formData.organizationCity);
        submitData.append('organizationAddress', formData.organizationAddress);
        submitData.append('hiringType', formData.hiringType);
        if (formData.hiringType === 'specific') {
          submitData.append('hiringDate', formData.hiringDate);
        }
      }

      // ✅ Call backend registration API
      const response = await authService.register(submitData);
      
      if (response.success) {
        // Show success message
        setSuccessMessage(response.message || 'Registration successful! Redirecting to login...');
        setShowSuccess(true);
        
        // Redirect to login after 2 seconds (carry state.from so login can redirect back)
        setTimeout(() => {
          navigate('/login', { state: fromState });
        }, 2000);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      // err is error.response?.data from authService — extract .message properly
      const msg =
        (typeof err === 'string' ? err : null) ||
        err?.message ||
        err?.error ||
        'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isEmailTyped = formData.email.trim().length > 0;
  const isPasswordTyped = formData.password.trim().length > 0; // ✅ for confirm password enable/disable

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Subtle decorative background shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-green-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="max-w-2xl w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="text-3xl font-bold text-gray-800">MCARE</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-2">Register</h1>
          <p className="text-gray-500">Start your healthcare career journey today</p>
        </div>

        {/* Info banner when redirected from Apply Now */}
        {fromState?.message && (
          <div className="mb-4 bg-blue-50 border border-blue-300 text-blue-800 px-4 py-3 rounded-lg flex items-start gap-2">
            <span className="mt-0.5 text-blue-600">ℹ️</span>
            <p className="text-sm">{fromState.message} Already have an account? <Link to="/login" state={fromState} className="font-semibold underline hover:text-blue-700">Log in here</Link>.</p>
          </div>
        )}

        {/* Register Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Dynamic Role Heading */}
            {formData.role && (
              <div className="col-span-full flex justify-center mt-2 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-wide">
                  {formData.role === 'candidate' ? 'Doctor/Seeker Registration' : 'Employer Registration'}
                </h2>
              </div>
            )}

            {/* Role Selection */}
            <CustomDropdown
              name="role"
              value={formData.role}
              onChange={handleChange}
              options={[
                { label: 'Select', value: '' },
                { label: 'Doctor/Seeker', value: 'candidate' },
                { label: 'Employer', value: 'hr' }
              ]}
              placeholder="Select"
              borderClass="border-2 border-blue-300 bg-blue-50"
              required
            />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <CustomDropdown
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  options={[
                    { label: 'Select', value: '' },
                    { label: 'Dr', value: 'Dr' },
                    { label: 'Mr', value: 'Mr' },
                    { label: 'Miss', value: 'Miss' },
                    { label: 'Others', value: 'Others' }
                  ]}
                  placeholder="Select"
                  borderClass="border-2 border-blue-300 bg-blue-50"
                  required
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* ✅ Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>

                <div className="flex items-center border-2 border-blue-300 bg-blue-50 rounded-lg focus-within:ring-2 focus-within:ring-blue-400">
                  <div className="flex items-center gap-1.5 pl-3 pr-2 border-r-2 border-r-blue-300 h-full">
                    <Phone className="text-gray-400 w-5 h-5 flex-shrink-0" />
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-transparent outline-none text-gray-700 font-medium text-sm cursor-pointer py-3 pr-1 appearance-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', paddingRight: '16px' }}
                    >
                      {countryCodes.map(code => (
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
                    className="w-full px-4 py-3 outline-none bg-transparent rounded-r-lg"
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Doctor/Seeker Only */}
              {formData.role === 'candidate' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                    <CustomDropdown
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      options={[
                        { label: 'Select Qualification', value: '' },
                        { label: 'MBBS', value: 'MBBS' },
                        { label: 'MD', value: 'MD' },
                        { label: 'MS', value: 'MS' },
                        { label: 'BDS', value: 'BDS' },
                        { label: 'MDS', value: 'MDS' },
                        { label: 'BHMS', value: 'BHMS' },
                        { label: 'BAMS', value: 'BAMS' },
                        { label: 'BUMS', value: 'BUMS' },
                        { label: 'BPT', value: 'BPT' },
                        { label: 'MPT', value: 'MPT' },
                        { label: 'B.Sc Nursing', value: 'B.Sc Nursing' },
                        { label: 'M.Sc Nursing', value: 'M.Sc Nursing' },
                        { label: 'GNM', value: 'GNM' },
                        { label: 'ANM', value: 'ANM' },
                        { label: 'B.Pharm', value: 'B.Pharm' },
                        { label: 'M.Pharm', value: 'M.Pharm' },
                        { label: 'Pharm.D', value: 'Pharm.D' },
                        { label: 'BMLT', value: 'BMLT' },
                        { label: 'DMLT', value: 'DMLT' },
                        { label: 'DM', value: 'DM' },
                        { label: 'MCh', value: 'MCh' },
                        { label: 'DNB', value: 'DNB' },
                        { label: 'PhD', value: 'PhD' },
                        { label: 'MPH', value: 'MPH' },
                        { label: 'MHA', value: 'MHA' },
                        { label: 'MBA (Healthcare)', value: 'MBA (Healthcare)' },
                        { label: 'Other', value: 'Other' }
                      ]}
                      placeholder="Select Qualification"
                      borderClass="border-2 border-blue-300 bg-blue-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
                    <input
                      type="file"
                      name="resume"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx"
                      className="w-full py-2.5 px-3 border-2 border-blue-300 bg-blue-50 rounded-lg text-gray-700 file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                      required
                    />
                  </div>

                  {/* Immediate Join / Join Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <CustomDropdown
                      name="joinType"
                      value={formData.joinType}
                      onChange={handleChange}
                      options={[
                        { label: 'Select Availability', value: '' },
                        { label: 'Immediate Join', value: 'immediate' },
                        { label: 'Specific Join Date', value: 'specific' }
                      ]}
                      placeholder="Select Availability"
                      borderClass="border-2 border-blue-300 bg-blue-50"
                    />
                  </div>

                  {formData.joinType === 'specific' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="joinDate"
                          value={formData.joinDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Interested Cities (multi-select, max 3) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Interested Cities <span className="text-gray-400 text-xs">(Select up to 3)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 border-2 border-blue-300 bg-blue-50 rounded-lg min-h-[48px]">
                      {formData.interestedCities.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">
                          {c}
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, interestedCities: prev.interestedCities.filter(x => x !== c) }))}
                            className="ml-1 text-blue-600 hover:text-blue-900 font-bold"
                          >×</button>
                        </span>
                      ))}
                      {formData.interestedCities.length < 3 && (
                        <select
                          value=""
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val && !formData.interestedCities.includes(val)) {
                              setFormData(prev => ({ ...prev, interestedCities: [...prev.interestedCities, val] }));
                            }
                          }}
                          className="bg-transparent border-none outline-none text-sm text-gray-500 cursor-pointer flex-1 min-w-[140px]"
                        >
                          <option value="">+ Add city...</option>
                          {INDIAN_CITIES.filter(c => !formData.interestedCities.includes(c)).map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Employer Only */}
              {formData.role === 'hr' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="organizationName"
                        value={formData.organizationName}
                        onChange={handleChange}
                        placeholder="Hospital / Clinic name"
                        className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Category</label>
                    <CustomDropdown
                      name="organizationCategory"
                      value={formData.organizationCategory}
                      onChange={handleChange}
                      options={[
                        { label: 'Select Category', value: '' },
                        { label: 'Hospital', value: 'Hospital' },
                        { label: 'Medical College', value: 'Medical College' },
                        { label: 'Clinic', value: 'Clinic' },
                        { label: 'Nursing Home', value: 'Nursing Home' },
                        { label: 'Diagnostic Center', value: 'Diagnostic Center' },
                        { label: 'Pharmacy', value: 'Pharmacy' },
                        { label: 'Other', value: 'Other' }
                      ]}
                      placeholder="Select Category"
                      borderClass="border-2 border-blue-300 bg-blue-50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Beds</label>
                    <input
                      type="number"
                      name="numberOfBeds"
                      value={formData.numberOfBeds}
                      onChange={handleChange}
                      placeholder="e.g. 100"
                      className="w-full px-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization City</label>
                    <input
                      type="text"
                      name="organizationCity"
                      value={formData.organizationCity}
                      onChange={handleChange}
                      placeholder="Organization city"
                      className="w-full px-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Organization Address</label>
                    <textarea
                      name="organizationAddress"
                      value={formData.organizationAddress}
                      onChange={handleChange}
                      placeholder="Full address"
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  {/* Immediate Hiring / Specific Hiring Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Timeline</label>
                    <CustomDropdown
                      name="hiringType"
                      value={formData.hiringType}
                      onChange={handleChange}
                      options={[
                        { label: 'Select Hiring Timeline', value: '' },
                        { label: 'Immediate Hiring', value: 'immediate' },
                        { label: 'Specific Hiring Date', value: 'specific' }
                      ]}
                      placeholder="Select Hiring Timeline"
                      borderClass="border-2 border-blue-300 bg-blue-50"
                    />
                  </div>

                  {formData.hiringType === 'specific' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          name="hiringDate"
                          value={formData.hiringDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* ✅ Confirm Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    placeholder={isEmailTyped ? 're-enter your email' : 'Enter email first'}
                    disabled={!isEmailTyped}
                    className={`w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                      ${!isEmailTyped ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    required={isEmailTyped}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full py-3 text-base min-h-[48px] pl-10 pr-12 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900"
                    style={showPassword ? { WebkitTextFillColor: '#111827', color: '#111827' } : undefined}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* ✅ Confirm Password (DISABLED until Password typed + auto-clears when password changes) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={isPasswordTyped ? 'Re-enter password' : 'Enter password first'}
                    disabled={!isPasswordTyped}
                    className={`w-full py-3 text-base min-h-[48px] pl-10 pr-12 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900
                      ${!isPasswordTyped ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    style={showConfirmPassword ? { WebkitTextFillColor: '#111827', color: '#111827' } : undefined}
                    required={isPasswordTyped}
                  />
                  <button
                    type="button"
                    disabled={!isPasswordTyped}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600
                      ${!isPasswordTyped ? 'opacity-50 cursor-not-allowed hover:text-gray-400' : ''}`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:outline-none focus:ring-blue-500"
              />
              <div className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => {
                    setPolicyType('terms');
                    setShowPolicy(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Terms of Service
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => {
                    setPolicyType('privacy');
                    setShowPolicy(true);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Privacy Policy
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-lg hover:from-emerald-700 hover:to-teal-600 font-medium flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Register</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center border-2 border-blue-500 text-blue-600 py-3 rounded-lg hover:bg-blue-50 font-medium"
          >
            Sign In
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-500 hover:text-emerald-600 font-medium transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">{successMessage}</p>
            <div className="animate-pulse text-blue-600 text-sm">Redirecting to login...</div>
          </div>
        </div>
      )}
      {/* Policy Modal */}
      {showPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white max-w-3xl w-full rounded-xl shadow-xl p-6 relative">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {policyType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
            </h2>

            <div className="max-h-[60vh] overflow-y-auto text-sm text-gray-700 space-y-4 pr-2">
              {policyType === 'terms' ? (
                <>
                  <p>
                    By creating an account on MCARE, you agree to comply with our platform rules,
                    usage policies, and applicable laws.
                  </p>
                  <p>
                    You are responsible for maintaining the confidentiality of your account
                    credentials and for all activities under your account.
                  </p>
                  <p>
                    MCARE reserves the right to suspend or terminate accounts that violate our
                    policies or misuse the platform.
                  </p>
                  <p>
                    These terms may be updated from time to time. Continued use of the platform
                    implies acceptance of the revised terms.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    We value your privacy. MCARE collects only the information necessary to provide
                    recruitment and healthcare career services.
                  </p>
                  <p>
                    Your personal data will never be sold and is shared only with authorized
                    recruiters or partners as required.
                  </p>
                  <p>
                    We implement industry-standard security measures to protect your data from
                    unauthorized access.
                  </p>
                  <p>
                    You may request data access, updates, or deletion by contacting our support
                    team.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowPolicy(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;