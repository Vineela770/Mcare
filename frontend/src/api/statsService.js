import axios from './axios';

export const statsService = {
  // Get homepage impact statistics
  getImpactStats: async () => {
    try {
      const response = await axios.get('/stats/impact');
      return response.data;
    } catch (error) {
      console.error('Error fetching impact stats:', error);
      // Return default values if API fails
      return {
        activeJobs: 0,
        facilities: 0,
        placements: 0,
        cities: 0
      };
    }
  },
};
