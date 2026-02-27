import axios from './axios';

export const shortlistService = {
  // Add to shortlist (same as saved jobs)
  createShortlist: async (jobId) => {
    try {
      const response = await axios.post('/api/candidate/saved-jobs', { jobId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to add to shortlist' };
    }
  },

  // Get user's shortlist
  getUserShortlist: async () => {
    try {
      const response = await axios.get('/api/candidate/saved-jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch shortlist' };
    }
  },

  // Remove from shortlist
  deleteShortlist: async (shortlistId) => {
    try {
      const response = await axios.delete(`/api/candidate/saved-jobs/${shortlistId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove from shortlist' };
    }
  },
};
