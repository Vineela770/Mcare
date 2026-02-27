import axios from './axios';

export const followService = {
  // Follow an employer
  follow: async (employerId) => {
    try {
      const response = await axios.post('/api/follow', { employerId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to follow employer' };
    }
  },

  // Get user's followed employers
  getUserFollows: async () => {
    try {
      const response = await axios.get('/api/follow');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch followed employers' };
    }
  },

  // Unfollow an employer
  unfollow: async (employerId) => {
    try {
      const response = await axios.delete(`/api/follow/${employerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to unfollow employer' };
    }
  },
};
