import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Stethoscope, Heart, Activity, Shield, CheckCircle, ArrowRight, Plus, Pill } from 'lucide-react';
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-8">
      {/* ===== Full-screen gradient background ===== */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-700" />

      {/* Layered gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/30 via-transparent to-teal-600/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      {/* ===== Floating healthcare icons (decorative) ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large decorative circles */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-400/10 to-teal-500/5 blur-sm" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-teal-400/10 to-emerald-500/5 blur-sm" />
        <div className="absolute top-1/4 -left-16 w-64 h-64 rounded-full bg-white/[0.03]" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 rounded-full bg-white/[0.03]" />

        {/* Floating medical icons */}
        <div className="absolute top-[8%] left-[8%] w-14 h-14 bg-white/[0.07] backdrop-blur-sm rounded-2xl flex items-center justify-center rotate-12 animate-pulse">
          <Stethoscope className="w-7 h-7 text-white/30" />
        </div>
        <div className="absolute top-[15%] right-[12%] w-12 h-12 bg-white/[0.07] backdrop-blur-sm rounded-2xl flex items-center justify-center -rotate-12">
          <Heart className="w-6 h-6 text-emerald-300/30" />
        </div>
        <div className="absolute bottom-[20%] left-[6%] w-10 h-10 bg-white/[0.07] backdrop-blur-sm rounded-xl flex items-center justify-center rotate-6">
          <Plus className="w-5 h-5 text-white/25" />
        </div>
        <div className="absolute bottom-[12%] right-[8%] w-14 h-14 bg-white/[0.07] backdrop-blur-sm rounded-2xl flex items-center justify-center -rotate-6 animate-pulse" style={{ animationDelay: '1s' }}>
          <Activity className="w-7 h-7 text-emerald-300/30" />
        </div>
        <div className="absolute top-[45%] left-[3%] w-11 h-11 bg-white/[0.05] backdrop-blur-sm rounded-xl flex items-center justify-center rotate-45">
          <Shield className="w-5 h-5 text-white/20" />
        </div>
        <div className="absolute top-[35%] right-[5%] w-10 h-10 bg-white/[0.05] backdrop-blur-sm rounded-xl flex items-center justify-center -rotate-12">
          <Pill className="w-5 h-5 text-white/20" />
        </div>
        <div className="absolute bottom-[35%] left-[15%] w-8 h-8 bg-white/[0.04] rounded-lg flex items-center justify-center rotate-12">
          <Plus className="w-4 h-4 text-white/15" />
        </div>
        <div className="absolute top-[60%] right-[15%] w-9 h-9 bg-white/[0.04] rounded-lg flex items-center justify-center rotate-[-20deg]">
          <Heart className="w-4 h-4 text-white/15" />
        </div>

        {/* Subtle grid/dot pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* ===== Main Content ===== */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2.5 mb-6">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-lg">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">MCARE</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-emerald-200/80 text-base">Sign in to access your healthcare dashboard</p>
        </div>

        {/* ===== Glass Card ===== */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50">
          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="text-center mb-2">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
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
                className="w-full bg-gradient-to-r from-teal-700 to-emerald-500 text-white py-3 rounded-lg font-medium hover:from-teal-800 hover:to-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
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
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
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
                  className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
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
                  className="w-full pl-10 pr-4 py-3 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>

              <button
                type="submit"
                disabled={recoveryLoading}
                className="w-full bg-gradient-to-r from-teal-700 to-emerald-500 text-white py-3 rounded-lg font-medium hover:from-teal-800 hover:to-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
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
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full py-3 text-base min-h-[48px] pl-10 pr-12 border-2 border-blue-300 bg-blue-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 transition"
                    style={showPassword ? { WebkitTextFillColor: '#111827', color: '#111827' } : undefined}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & links */}
              <div className="flex items-start justify-between">
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-400" />
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
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition"
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
                    className="mt-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition"
                  >
                    Recovery account?
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-700 to-emerald-500 text-white py-3.5 rounded-lg font-semibold disabled:opacity-50 hover:from-teal-800 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25"
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
                className="w-full border-2 border-gray-200 bg-white py-3 rounded-lg font-medium flex justify-center items-center space-x-3 disabled:opacity-50 hover:bg-gray-50 hover:border-gray-300 transition"
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
          <Link to="/" className="text-white/70 hover:text-white font-medium text-sm transition">
            ← Back to Home
          </Link>
        </div>

        {/* Bottom trust badges */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <Shield className="w-3.5 h-3.5" />
            <span>Secure Login</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Healthcare Platform</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/30" />
          <div className="flex items-center gap-1.5 text-white/50 text-xs">
            <Heart className="w-3.5 h-3.5" />
            <span>10,000+ Users</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;