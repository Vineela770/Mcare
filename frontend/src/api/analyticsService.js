// Backend integration removed - returning mock data

export const analyticsService = {
  getDashboard: async (employerId) => {
    console.log('[MOCK] getDashboard called with:', employerId);
    return { 
      totalJobs: 0, 
      activeJobs: 0, 
      totalApplications: 0, 
      pendingApplications: 0 
    };
  },

  getApplicationsByStatus: async (employerId) => {
    console.log('[MOCK] getApplicationsByStatus called with:', employerId);
    return { 
      pending: 0, 
      reviewed: 0, 
      accepted: 0, 
      rejected: 0 
    };
  },
};
