import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Stethoscope, Heart, Activity, Shield, CheckCircle, ArrowRight, Briefcase, Users, ClipboardCheck, Phone } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col">
      {/* ===== Top Navbar ===== */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-3 sm:px-6 py-3 flex items-center justify-between relative z-30">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">MCARE</span>
            <span className="block text-[10px] text-emerald-600 font-semibold -mt-0.5 tracking-widest uppercase">Healthcare Jobs</span>
          </div>
        </Link>
        <div className="hidden sm:flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-teal-600" />
            <span>Support: 9:30-6:30 PM</span>
          </div>
          <span className="text-gray-300">|</span>
          <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold transition flex items-center gap-1">
            JOB SEEKER
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ===== Full-width unified background ===== */}
      <div className="flex-1 relative overflow-hidden">
        {/* Seamless gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-teal-50/60 to-emerald-50/40" />
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-50/30 via-transparent to-transparent" />

        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-teal-200/20 to-emerald-100/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-gradient-to-tl from-emerald-200/15 to-teal-100/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-100/10 rounded-full blur-2xl" />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'radial-gradient(circle, #0d9488 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }} />
        </div>

        {/* ===== Content: Hero + Form flowing together ===== */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-16 flex flex-col lg:flex-row items-center gap-6 sm:gap-10 lg:gap-16">

          {/* ───── Hero Content (left area, no partition) ───── */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Hero image */}
            <div className="mb-4 sm:mb-8 w-full max-w-md">
              <img
                src="https://thumbs.dreamstime.com/b/doctor-health-insurance-healthcare-graphic-concept-hospital-related-icon-interface-showing-people-money-planning-risk-173576660.jpg"
                alt="Healthcare professional"
                className="w-full h-auto rounded-2xl shadow-2xl shadow-teal-200/30 object-cover"
              />
            </div>

            {/* Hero text */}
            <p className="text-lg text-teal-600 font-medium italic mb-2">Let's Find</p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.75rem] font-extrabold leading-tight mb-3">
              <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">YOUR DREAM</span>
              <br />
              <span className="text-gray-800">HEALTHCARE CAREER</span>
            </h1>
            <p className="text-gray-500 text-base lg:text-lg max-w-md">
              Transform Your Hiring Experience Today
            </p>

            {/* Trust stats row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-6 mt-6 sm:mt-8">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-teal-600">1000+</p>
                <p className="text-xs text-gray-500">Active Jobs</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">500+</p>
                <p className="text-xs text-gray-500">Hospitals</p>
              </div>
              <div className="w-px h-8 sm:h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-teal-600">10K+</p>
                <p className="text-xs text-gray-500">Professionals</p>
              </div>
            </div>
          </div>

          {/* ───── Login Form Card (floating, no partition) ───── */}
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100/80 p-5 sm:p-8">
              {isForgotPassword ? (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="text-center mb-2">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                      className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-teal-500/20"
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>

                  <button type="button" onClick={goBackToLogin} className="w-full text-sm text-gray-500 hover:text-teal-600 transition">
                    ← Back to Login
                  </button>
                </form>
              ) : isRecoveryAccount ? (
                <form onSubmit={handleRecoveryAccount} className="space-y-5">
                  <div className="text-center mb-2">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
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
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{recoveryError}</div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="email" required value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)}
                      placeholder="Account email"
                      className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="password" required value={recoveryPassword} onChange={(e) => setRecoveryPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                    />
                  </div>

                  <button type="submit" disabled={recoveryLoading}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-lg font-semibold hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-teal-500/20"
                  >
                    {recoveryLoading ? 'Recovering...' : 'Recover My Account'}
                  </button>

                  <button type="button" onClick={goBackToLogin} className="w-full text-sm text-gray-500 hover:text-teal-600 transition">
                    ← Back to Login
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Header */}
                  <div className="mb-1">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-500 text-sm mt-1">Sign in to access your healthcare dashboard</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email" name="email" value={formData.email} onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
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
                        type={showPassword ? 'text' : 'password'} name="password"
                        value={formData.password} onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full py-3 text-base min-h-[48px] pl-10 pr-12 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 transition"
                        style={showPassword ? { WebkitTextFillColor: '#111827', color: '#111827' } : undefined}
                        required
                      />
                      <button type="button" onClick={() => setShowPassword((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Secure Login Button */}
                  <button type="submit" disabled={loading}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3.5 rounded-lg font-semibold disabled:opacity-50 hover:from-teal-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25"
                  >
                    {loading ? 'Signing in...' : (
                      <>
                        <Shield className="w-4 h-4" />
                        <span>Secure Login</span>
                      </>
                    )}
                  </button>

                  {/* Forgot & Recovery */}
                  <div className="flex items-center justify-between">
                    <button type="button" onClick={() => { setIsForgotPassword(true); setIsRecoveryAccount(false); setResetMessage(''); setResetEmail(''); }}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium transition">
                      Forgot Password?
                    </button>
                    <button type="button" onClick={() => { setIsRecoveryAccount(true); setIsForgotPassword(false); setRecoveryMessage(''); setRecoveryEmail(''); }}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium transition">
                      Recovery Account?
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                    <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-400">or</span></div>
                  </div>

                  {/* Google */}
                  <button type="button" onClick={handleGoogleSignIn} disabled={googleLoading}
                    className="w-full border border-gray-200 bg-white py-3 rounded-lg font-medium flex justify-center items-center space-x-3 disabled:opacity-50 hover:bg-gray-50 hover:border-gray-300 transition shadow-sm"
                  >
                    <GoogleIcon />
                    <span className="text-gray-700">{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
                  </button>
                </form>
              )}

              {/* Register */}
              <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  New to MCARE?{' '}
                  <Link to="/register" className="text-teal-600 hover:text-teal-700 font-semibold transition">Create an Account</Link>
                </p>
              </div>

              <div className="text-center mt-3">
                <Link to="/" className="text-xs text-gray-400 hover:text-gray-600 transition">← Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Feature Strip ===== */}
      <div className="bg-white border-t border-gray-100 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
            <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Job Board & Resumes</p>
              <p className="text-xs text-gray-500">1000+ healthcare openings · 5 min to post</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">Verified Candidates</p>
              <p className="text-xs text-gray-500">Pre-assessed · Benchmarked profiles</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">500+ Employers</p>
              <p className="text-xs text-gray-500">Top hospitals · All specialties</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;