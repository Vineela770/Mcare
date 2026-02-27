import axios from './axios';

export const employerService = {
  // Create employer profile
  createProfile: async (employerData) => {
    try {
      const response = await axios.post('/api/employer/profile', employerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create employer profile' };
    }
  },

  // Get employer profile by user ID
  getProfileByUserId: async () => {
    try {
      const response = await axios.get('/api/employer/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employer profile' };
    }
  },

  // Get employer profile by ID
  getProfileById: async (employerId) => {
    try {
      const response = await axios.get(`/api/employer/${employerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employer details' };
    }
  },

  // Update employer profile
  updateProfile: async (employerData) => {
    try {
      const response = await axios.put('/api/employer/profile', employerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update employer profile' };
    }
  },
};
