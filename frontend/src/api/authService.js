import axios from './axios';

export const authService = {
  // REGISTER
  register: async (formData) => {
    try {
      const response = await axios.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // for resume upload
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  // LOGIN
  login: async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  // GOOGLE LOGIN
  googleLogin: async (googleToken) => {
    try {
      const response = await axios.post('/api/auth/google-login', { token: googleToken });
      const { token, user } = response.data;
      
      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      return { token, user };
    } catch (error) {
      throw error.response?.data || { message: 'Google login failed' };
    }
  },

  // FORGOT PASSWORD
  forgotPassword: async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send reset email' };
    }
  },

  // RESET PASSWORD
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axios.post('/api/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password reset failed' };
    }
  },

  // CHANGE PASSWORD
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await axios.post('/api/auth/change-password', { oldPassword, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Password change failed' };
    }
  },

  // DELETE PROFILE
  deleteProfile: async () => {
    try {
      const response = await axios.delete('/api/auth/delete-profile');
      // Clear local storage on successful deletion
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Profile deletion failed' };
    }
  },

  // AUTH HELPERS
  getToken: () => localStorage.getItem("token"),

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!localStorage.getItem("token"),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
