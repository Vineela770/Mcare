import axios from './axios';

export const analyticsService = {
  // Get dashboard analytics
  getDashboard: async () => {
    try {
      const response = await axios.get('/api/analytics/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard analytics' };
    }
  },

  // Get applications by status
  getApplicationsByStatus: async (employerId) => {
    try {
      const response = await axios.get(`/api/analytics/applications-by-status/${employerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications data' };
    }
  },
};
