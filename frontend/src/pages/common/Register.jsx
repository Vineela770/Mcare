import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, MapPin, UserPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // ✅ State for professional success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
  const [policyType, setPolicyType] = useState('terms');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
      ...(name === 'role' && { qualification: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- Enhanced Validation Logic ---
    if (formData.email !== formData.confirmEmail) {
      setError('Email addresses do not match');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // ✅ PASSWORD STRENGTH VALIDATION - Match backend requirements
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain: uppercase, lowercase, number, and special character (@$!%*?&)');
      return;
    }

    // ✅ PHONE VALIDATION
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Phone number must be at least 10 digits');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      
      Object.keys(formData).forEach((key) => {
        if (key === 'resume') {
          if (formData.resume) data.append('resume', formData.resume);
        } else {
          data.append(key, formData[key]);
        }
      });

      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await axios.post(`${API_BASE}/api/auth/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // ✅ SUCCESS: Show professional Modal
        setShowSuccessModal(true);
      }

    } catch (err) {
      console.error("❌ Register Error:", err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
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

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            {formData.role && (
              <div className="col-span-full flex justify-center mt-2 mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 tracking-wide">
                  {formData.role === 'candidate' ? 'Doctor Registration' : 'Employer Registration'}
                </h2>
              </div>
            )}

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              required
            >
              <option value="" disabled>Select Role</option>
              <option value="candidate">JobSeeker</option>
              <option value="hr">Recruiter</option>
            </select>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500"
                  required
                >
                  <option value="">Select</option>
                  <option value="Dr">Dr</option>
                  <option value="Mr">Mr</option>
                  <option value="Miss">Miss</option>
                  <option value="Others">Others</option>
                </select>
              </div>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

              {formData.role === 'candidate' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
                    <select
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      required
                    >
                      <option value="" disabled>Select Qualification</option>
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
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                      required
                    />
                  </div>
                </>
              )}

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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                </div>
              </div>

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
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Password Requirements:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li className={formData.password.length >= 8 ? 'text-green-600 font-semibold' : ''}>
                      {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-600 font-semibold' : ''}>
                      {/[A-Z]/.test(formData.password) ? '✓' : '○'} One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(formData.password) ? 'text-green-600 font-semibold' : ''}>
                      {/[a-z]/.test(formData.password) ? '✓' : '○'} One lowercase letter
                    </li>
                    <li className={/\d/.test(formData.password) ? 'text-green-600 font-semibold' : ''}>
                      {/\d/.test(formData.password) ? '✓' : '○'} One number
                    </li>
                    <li className={/[@$!%*?&]/.test(formData.password) ? 'text-green-600 font-semibold' : ''}>
                      {/[@$!%*?&]/.test(formData.password) ? '✓' : '○'} One special character (@$!%*?&)
                    </li>
                  </ul>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {formData.role === 'hr' && (
              <div className="space-y-6 pt-4">
                <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Organization Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <label className="block text-sm font-medium mb-1">Organization Name</label>
                    <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select name="organizationCategory" value={formData.organizationCategory} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required>
                      <option value="" disabled>Select</option>
                      <option value="Hospital">Hospital</option>
                      <option value="Clinic">Clinic</option>
                      <option value="Diagnostic Center">Diagnostic Center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Beds</label>
                    <select name="numberOfBeds" value={formData.numberOfBeds} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required>
                      <option value="" disabled>Select</option>
                      <option value="1-10">1–10</option>
                      <option value="11-50">11–50</option>
                      <option value="51-100">51–100</option>
                      <option value="100+">100+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input type="text" name="organizationCity" value={formData.organizationCity} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg" required />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-sm font-medium mb-1">Full Address</label>
                    <textarea name="organizationAddress" value={formData.organizationAddress} onChange={handleChange} rows="3" className="w-full px-4 py-3 border rounded-lg" required />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })} className="w-4 h-4 mt-1 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500" />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the <button type="button" onClick={() => { setPolicyType('terms'); setShowPolicy(true); }} className="text-cyan-600 hover:text-cyan-700 font-medium underline">Terms of Service</button> and <button type="button" onClick={() => { setPolicyType('privacy'); setShowPolicy(true); }} className="text-cyan-600 hover:text-cyan-700 font-medium underline">Privacy Policy</button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl hover:from-cyan-600 hover:to-blue-700 font-bold flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg transition-all active:scale-95"
            >
              {loading ? <span>Creating Account...</span> : <><UserPlus className="w-5 h-5" /><span>Register</span></>}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Already have an account?</span></div>
          </div>

          <Link to="/login" className="block w-full text-center border-2 border-cyan-500 text-cyan-600 py-3 rounded-lg hover:bg-cyan-50 font-bold transition-all">Sign In</Link>
        </div>
      </div>

      {/* ✅ SUCCESS MODAL: Professional registration success with email confirmation notice */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8 text-center mx-4 transform animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">🎉 Registration Successful!</h2>
            <p className="text-gray-600 mb-4">Welcome to MCARE! Your account has been created successfully.</p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-900 font-semibold mb-2">📧 Check Your Email</p>
              <p className="text-xs text-blue-700">
                We've sent a welcome email to <strong>{formData.email}</strong> with next steps and login instructions.
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/login')} 
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              Sign In Now
            </button>
          </div>
        </div>
      )}

      {/* Policy Modal */}
      {showPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl p-8 relative mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{policyType === 'terms' ? 'Terms of Service' : 'Privacy Policy'}</h2>
            <div className="max-h-[50vh] overflow-y-auto text-sm text-gray-700 space-y-4 pr-4">
              <p>By using MCARE, you agree to our policies regarding data security and professional conduct.</p>
              <p>We ensure that your credentials and medical qualifications are kept secure and shared only with verified employers.</p>
            </div>
            <div className="mt-8 text-right">
              <button onClick={() => setShowPolicy(false)} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;