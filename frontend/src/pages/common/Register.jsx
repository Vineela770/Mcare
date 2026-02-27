import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { authService } from '../../api/authService';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    fullName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    location: '',
    qualification: '',
    designation: '',
    resume: null,
    password: '',
    confirmPassword: '',
    role: '',
    agreeTerms: false,

    // Employer – Organization Info
    organizationName: '',
    organizationCategory: '',
    numberOfBeds: '',
    organizationCity: '',
    organizationAddress: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [policyType, setPolicyType] = useState('terms'); // 'terms' | 'privacy'
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Country code dropdown (ONLY codes)
  const [countryCode, setCountryCode] = useState('+91');
  const countryCodes = ['+91', '+1', '+44'];

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
        ...(name === 'role' && { qualification: '', designation: '' }),
      };
    });

    // optional: clear error as user types
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      submitData.append('location', formData.location);
      submitData.append('role', formData.role);
      
      // Role-specific fields
      if (formData.role === 'candidate') {
        submitData.append('qualification', formData.qualification);
        submitData.append('designation', formData.designation);
        if (formData.resume) {
          submitData.append('resume', formData.resume);
        }
      } else if (formData.role === 'hr') {
        submitData.append('organizationName', formData.organizationName);
        submitData.append('organizationCategory', formData.organizationCategory);
        submitData.append('numberOfBeds', formData.numberOfBeds);
        submitData.append('organizationCity', formData.organizationCity);
        submitData.append('organizationAddress', formData.organizationAddress);
      }

      // ✅ Call backend registration API
      const response = await authService.register(submitData);
      
      if (response.success) {
        // Show success message
        setSuccessMessage(response.message || 'Registration successful! Redirecting to login...');
        setShowSuccess(true);
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isEmailTyped = formData.email.trim().length > 0;
  const isPasswordTyped = formData.password.trim().length > 0; // ✅ for confirm password enable/disable

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">MCARE</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Register</h1>
          <p className="text-gray-600">Start your healthcare career journey today</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
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
                  {formData.role === 'candidate' ? 'Doctor Registration' : 'Employer Registration'}
                </h2>
              </div>
            )}

            {/* Role Selection */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            >
              <option value="" disabled>
                Select
              </option>
              <option value="candidate">Doctor</option>
              <option value="hr">Employer</option>
            </select>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg"
                  required
                >
                  <option value="">Select</option>
                  <option value="Dr">Dr</option>
                  <option value="Mr">Mr</option>
                  <option value="Miss">Miss</option>
                  <option value="Others">Others</option>
                </select>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* ✅ Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>

                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500">
                  <div className="flex items-center gap-2 px-3 py-3 bg-gray-50 border-r border-gray-300">
                    <Phone className="text-gray-400 w-5 h-5" />
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
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
                    className="w-full px-4 py-3 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Doctor Only */}
              {formData.role === 'candidate' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                    <select
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    >
                      <option value="" disabled>
                        Select Qualification
                      </option>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Resume</label>
                    <input
                      type="file"
                      name="resume"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx"
                      className="w-full"
                      required
                    />
                  </div>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                      ${!isEmailTyped ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    required={isEmailTyped}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* ✅ Confirm Password (DISABLED until Password typed + auto-clears when password changes) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={isPasswordTyped ? 'Re-enter password' : 'Enter password first'}
                    disabled={!isPasswordTyped}
                    className={`w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                      ${!isPasswordTyped ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    required={isPasswordTyped}
                  />
                  <button
                    type="button"
                    disabled={!isPasswordTyped}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600
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
                className="w-4 h-4 mt-1 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
              />
              <div className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => {
                    setPolicyType('terms');
                    setShowPolicy(true);
                  }}
                  className="text-cyan-600 hover:text-cyan-700 font-medium underline"
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
                  className="text-cyan-600 hover:text-cyan-700 font-medium underline"
                >
                  Privacy Policy
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg hover:from-cyan-600 hover:to-blue-700 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="block w-full text-center border-2 border-cyan-500 text-cyan-600 py-3 rounded-lg hover:bg-cyan-50 font-medium"
          >
            Sign In
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-cyan-600 font-medium">
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
            <div className="animate-pulse text-cyan-600 text-sm">Redirecting to login...</div>
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
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
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