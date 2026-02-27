import axios from './axios';

export const alertService = {
  // Create a new job alert
  createAlert: async (alertData) => {
    try {
      const response = await axios.post('/api/candidate/alerts', alertData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create alert' };
    }
  },

  // Get user's job alerts
  getUserAlerts: async () => {
    try {
      const response = await axios.get('/api/candidate/alerts');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch alerts' };
    }
  },

  // Update an alert
  updateAlert: async (alertId, alertData) => {
    try {
      const response = await axios.put(`/api/candidate/alerts/${alertId}`, alertData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update alert' };
    }
  },

  // Toggle alert active status
  toggleAlert: async (alertId) => {
    try {
      const response = await axios.put(`/api/candidate/alerts/${alertId}/toggle`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to toggle alert' };
    }
  },

  // Delete an alert
  deleteAlert: async (alertId) => {
    try {
      const response = await axios.delete(`/api/candidate/alerts/${alertId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete alert' };
    }
  },
};
