// Backend integration removed - returning mock data

export const applicationService = {
  createApplication: async (applicationData) => {
    console.log('[MOCK] createApplication called with:', applicationData);
    return { id: Date.now(), ...applicationData, status: 'pending' };
  },

  getUserApplications: async (userId) => {
    console.log('[MOCK] getUserApplications called with:', userId);
    return [];
  },

  getJobApplications: async (jobId) => {
    console.log('[MOCK] getJobApplications called with:', jobId);
    return [];
  },

  updateApplicationStatus: async (applicationId, status) => {
    console.log('[MOCK] updateApplicationStatus called with:', { applicationId, status });
    return { success: true, status };
  },

  getApplicationStats: async (jobId) => {
    console.log('[MOCK] getApplicationStats called with:', jobId);
    return { total: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 };
  },
};
