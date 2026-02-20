import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // Ensure this context doesn't have mock data
import { authService } from '../api/authService';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      /**
       * 🛠️ FIX 1: Wrap arguments into a single object { email, password, role }
       * to match your authService.login(loginData) definition.
       */
      const result = await authService.login({ email, password, role });

      /**
       * 🛠️ FIX 2: Ensure the Context login isn't using mock data internally.
       * This updates the global state with the REAL user/token from PostgreSQL.
       */
      login(result.user, result.token);

      /**
       * 🛠️ FIX 3: Update paths to match your actual routing 
       * (e.g., /candidate/dashboard or /dashboard).
       */
      if (result.user.role === 'candidate') {
        navigate('/candidate/dashboard');
      } else if (result.user.role === 'hr') {
        navigate('/employer-dashboard');
      } else if (result.user.role === 'admin' || result.user.role === 'administrator') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      // Catch backend errors like "Invalid credentials"
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Login As</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="" disabled>Select Role</option>
          <option value="candidate">Doctor</option>
          <option value="hr">Employer</option>
          <option value="admin">Administrator</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          placeholder="raju@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}