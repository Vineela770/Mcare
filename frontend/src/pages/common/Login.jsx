import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }));
    setError('');
  };

  const redirectByRole = (role) => {
    switch (role) {
      case 'candidate':
        navigate('/candidate/dashboard');
        break;
      case 'hr':
        navigate('/hr/dashboard');
        break;
      case 'admin':
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
      setError(err.message || 'Invalid credentials. Please try again.');
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
    setRecoveryLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRecoveryMessage('Please check your email for further details.');
      setRecoveryEmail('');
    } catch {
      setRecoveryMessage('Failed to send recovery email. Try again.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const goBackToLogin = () => {
    setIsForgotPassword(false);
    setIsRecoveryAccount(false);
    setResetMessage('');
    setRecoveryMessage('');
    setResetEmail('');
    setRecoveryEmail('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <span className="text-3xl font-bold text-gray-900">MCARE</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your account</p>
        </div>

        {/* Single card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 text-center">Reset Password</h2>
              <p className="text-sm text-gray-600 text-center">
                Enter your email to receive a reset link.
              </p>

              {resetMessage && (
                <div className="bg-cyan-50 border border-cyan-200 text-cyan-700 px-4 py-3 rounded-lg text-sm">
                  {resetMessage}
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50"
              >
                {resetLoading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                onClick={goBackToLogin}
                className="w-full text-sm text-gray-600 hover:text-cyan-600"
              >
                ← Back to Login
              </button>
            </form>
          ) : isRecoveryAccount ? (
            <form onSubmit={handleRecoveryAccount} className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 text-center">Recovery Account</h2>
              <p className="text-sm text-gray-600 text-center">
                Add a recovery email to help you recover your account.
              </p>

              {recoveryMessage && (
                <div className="bg-cyan-50 border border-cyan-200 text-cyan-700 px-4 py-3 rounded-lg text-sm">
                  {recoveryMessage}
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="Enter recovery email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <button
                type="submit"
                disabled={recoveryLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50"
              >
                {recoveryLoading ? 'Sending...' : 'Next'}
              </button>

              <button
                type="button"
                onClick={goBackToLogin}
                className="w-full text-sm text-gray-600 hover:text-cyan-600"
              >
                ← Back to Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember & links (✅ Recovery below Forgot) */}
              <div className="flex items-start justify-between">
                {/* Left: Remember */}
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-cyan-600 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>

                {/* Right: Forgot + Recovery below */}
                <div className="flex flex-col items-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setIsRecoveryAccount(false);
                      setResetMessage('');
                      setResetEmail('');
                    }}
                    className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
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
                    className="mt-1 text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    Recovery account?
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full border border-gray-300 py-3 rounded-lg font-medium flex justify-center items-center space-x-3 disabled:opacity-50"
              >
                <GoogleIcon />
                <span>{googleLoading ? 'Connecting...' : 'Continue with Google'}</span>
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">New to MCARE?</span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="block w-full text-center border-2 border-cyan-500 text-cyan-600 py-3 rounded-lg hover:bg-cyan-50 font-medium"
          >
            Register
          </Link>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-cyan-600 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;