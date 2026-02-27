import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    const result = await authService.register(userData);
    login(result.user, result.token);
    return result;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        register,
        isAuthenticated: !loading && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
}