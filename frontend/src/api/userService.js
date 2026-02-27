import axios from './axios';

export const userService = {
  // Get user profile/resume data
  getProfile: async () => {
    try {
      const response = await axios.get('/api/candidate/resume');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Update user profile/resume data
  updateProfile: async (profileData) => {
    try {
      const response = await axios.put('/api/candidate/resume', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await axios.post('/api/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to change password' };
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await axios.get('/api/candidate/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
    }
  },

  // Delete account
  deleteAccount: async () => {
    try {
      const response = await axios.delete('/api/auth/delete-profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete account' };
    }
  },

  // Upload profile photo
  uploadPhoto: async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      const response = await axios.post('/api/candidate/upload-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload photo' };
    }
  },

  // Upload resume
  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await axios.post('/api/candidate/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload resume' };
    }
  },
};
