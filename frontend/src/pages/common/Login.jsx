import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Stethoscope, Briefcase, Users, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { authService } from '../../api/authService';

const GoogleIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303C33.732 32.657 29.25 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.048 6.053 29.272 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.657 16.108 19.01 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.048 6.053 29.272 4 24 4c-7.682 0-14.36 4.326-17.694 10.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.149 0 9.86-1.977 13.409-5.196l-6.199-5.247C29.16 35.091 26.715 36 24 36c-5.229 0-9.692-3.323-11.266-7.946l-6.52 5.023C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.75 2.232-2.262 4.142-4.093 5.557l.003-.002 6.199 5.247C36.97 39.202 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
    />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromPath = location.state?.from || null;
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ✅ Forgot password toggle
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // ✅ Recovery account toggle
  const [isRecoveryAccount, setIsRecoveryAccount] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryPassword, setRecoveryPassword] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const redirectByRole = (role) => {
    // If redirected here from a protected action, send candidate back
    if (fromPath && role === 'candidate') {
      navigate(fromPath);
      return;
    }
    switch (role) {
      case 'candidate':
        navigate('/candidate/dashboard');
        break;
      case 'hr':
        navigate('/hr/dashboard');
        break;
      case 'admin':
      case 'administrator':
        navigate('/admin/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    try {
      // Call backend API for login - backend returns user with their registered role
      const { token, user } = await authService.login(formData.email, formData.password);
      
      // Auto-redirect based on user's registered role
      login(user, token);
      redirectByRole(user.role);
    } catch (err) {
      // Check if account is recoverable (soft-deleted)
      if (err.recoverable && err.email) {
        setRecoveryEmail(err.email);
        setIsRecoveryAccount(true);
        setError('');
        setRecoveryError('');
        setRecoveryMessage(err.message);
      } else {
        setError(err.message || 'Invalid credentials. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');

    setGoogleLoading(true);
    try {
      // TODO: Implement actual Google OAuth flow
      // For now, show message that Google login is not implemented
      setError('Google sign-in will be available soon. Please use email/password login.');
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetMessage('');
    setResetLoading(true);

    try {
      const response = await authService.forgotPassword(resetEmail);
      setResetMessage(response.message || 'Password reset link sent to your email.');
      setResetEmail('');
    } catch (err) {
      setResetMessage(err.message || 'Failed to send reset link. Try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleRecoveryAccount = async (e) => {
    e.preventDefault();
    setRecoveryMessage('');
    setRecoveryError('');
    setRecoveryLoading(true);

    try {
      const response = await authService.recoverAccount(recoveryEmail, recoveryPassword);
      setRecoveryMessage(response.message || 'Account recovered successfully! You can now log in.');
      setRecoveryPassword('');
      // Go back to login after 2 seconds
      setTimeout(() => {
        goBackToLogin();
      }, 2000);
    } catch (err) {
      setRecoveryError(err.message || 'Failed to recover account. Try again.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const goBackToLogin = () => {
    setIsForgotPassword(false);
    setIsRecoveryAccount(false);
    setResetMessage('');
    setRecoveryMessage('');
    setRecoveryError('');
    setResetEmail('');
    setRecoveryEmail('');
    setRecoveryPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ===== LEFT SIDE — Hero / Branding ===== */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-800 via-emerald-700 to-emerald-500 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/5 rounded-full" />

        {/* Logo */}
        <Link to="/" className="relative z-10 inline-flex items-center space-x-2">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="text-2xl font-bold text-white">MCARE</span>
        </Link>

        {/* Main Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Let's Find<br />
            <span className="text-emerald-200">Your Dream</span><br />
            Healthcare Career
          </h1>
          <p className="text-emerald-100 text-lg mb-8 max-w-md">
            Transform your career with India's leading healthcare job platform. Connect with top hospitals and clinics.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Briefcase className="w-6 h-6 text-emerald-200 mb-2" />
              <p className="text-white font-semibold text-sm">1000+ Jobs</p>
              <p className="text-emerald-200 text-xs">Verified openings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Users className="w-6 h-6 text-emerald-200 mb-2" />
              <p className="text-white font-semibold text-sm">500+ Employers</p>
              <p className="text-emerald-200 text-xs">Trusted hospitals</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Stethoscope className="w-6 h-6 text-emerald-200 mb-2" />
              <p className="text-white font-semibold text-sm">All Specialties</p>
              <p className="text-emerald-200 text-xs">Doctors to admin</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <Shield className="w-6 h-6 text-emerald-200 mb-2" />
              <p className="text-white font-semibold text-sm">Secure Platform</p>
              <p className="text-emerald-200 text-xs">100% data safety</p>
            </div>
          </div>
        </div>

        {/* Bottom testimonial bar */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-300 flex items-center justify-center text-xs font-bold text-teal-900">D</div>
              <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-xs font-bold text-blue-900">N</div>
              <div className="w-8 h-8 rounded-full bg-amber-300 flex items-center justify-center text-xs font-bold text-amber-900">S</div>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Trusted by 10,000+ healthcare professionals</p>
              <p className="text-emerald-200 text-xs">Join India's fastest growing medical job portal</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT SIDE — Login Form ===== */}
      <div className="flex-1 flex flex-col bg-gray-50 lg:bg-white">
        {/* Mobile header (shows only on small screens) */}
        <div className="lg:hidden bg-gradient-to-r from-teal-800 to-emerald-600 px-6 py-6">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold text-white">MCARE</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-4">Welcome Back</h1>
          <p className="text-emerald-100 text-sm">Sign in to access your account</p>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 py-8 lg:py-12">
          <div className="w-full max-w-md">
            {/* Desktop heading */}
            <div className="hidden lg:block mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-500 mt-2">Sign in to access your account</p>
            </div>

            {/* White card */}
            <div className="bg-white rounded-2xl shadow-lg lg:shadow-xl p-8 border border-gray-100">
              {isForgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="text-center mb-2">
                    <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-7 h-7 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Reset Password</h2>
                    <p className="text-sm text-gray-500 mt-1">Enter your email to receive a reset link</p>
                  </div>

                  {resetMessage && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{resetMessage}</span>
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-gradient-to-r from-teal-700 to-emerald-500 text-white py-3 rounded-lg font-medium hover:from-teal-800 hover:to-emerald-600 disabled:opacity-50 transition-all"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  <button
                    type="button"
                    onClick={goBackToLogin}
                    className="w-full text-sm text-gray-500 hover:text-blue-600 transition"
                  >
                    ← Back to Login
                  </button>
                </form>
              ) : isRecoveryAccount ? (
                <form onSubmit={handleRecoveryAccount} className="space-y-5">
                  <div className="text-center mb-2">
                    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">Recover Account</h2>
                    <p className="text-sm text-gray-500 mt-1">Your account is within the 30-day recovery window</p>
                  </div>

                  {recoveryMessage && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{recoveryMessage}</span>
                    </div>
                  )}

                  {recoveryError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {recoveryError}
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      required
                      value={recoveryEmail}
                      onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="Account email"
                      className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      required
                      value={recoveryPassword}
                      onChange={(e) => setRecoveryPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="w-full bg-gradient-to-r from-teal-700 to-emerald-500 text-white py-3 rounded-lg font-medium hover:from-teal-800 hover:to-emerald-600 disabled:opacity-50 transition-all"
                  >
                    {recoveryLoading ? 'Recovering...' : 'Recover My Account'}
                  </button>

                  <button
                    type="button"
                    onClick={goBackToLogin}
                    className="w-full text-sm text-gray-500 hover:text-blue-600 transition"
                  >
                    ← Back to Login
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
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
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & links */}
                  <div className="flex items-start justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>

                    <div className="flex flex-col items-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsForgotPassword(true);
                          setIsRecoveryAccount(false);
                          setResetMessage('');
                          setResetEmail('');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Forgot password?
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsRecoveryAccount(true);
                          setIsForgotPassword(false);
                          setRecoveryMessage('');
                          setRecoveryEmail('');
                        }}
                        className="mt-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Recovery account?
                      </button>
                    </div>
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-700 to-emerald-500 text-white py-3.5 rounded-lg font-semibold disabled:opacity-50 hover:from-teal-800 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
                  >
                    {loading ? 'Signing in...' : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Google */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading}
                    className="w-full border-2 border-gray-200 py-3 rounded-lg font-medium flex justify-center items-center space-x-3 disabled:opacity-50 hover:bg-gray-50 transition"
                  >
                    <GoogleIcon />
                    <span className="text-gray-700">{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-400">New to MCARE?</span>
                </div>
              </div>

              {/* Register Link */}
              <Link
                to="/register"
                className="block w-full text-center border-2 border-blue-500 text-blue-600 py-3 rounded-lg hover:bg-blue-50 font-medium transition"
              >
                Create an Account
              </Link>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link to="/" className="text-gray-400 hover:text-gray-600 font-medium text-sm transition">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;