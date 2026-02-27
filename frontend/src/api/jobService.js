// Backend integration removed - returning mock data

export const jobService = {
  getJobs: async (limit = 20, offset = 0) => {
    console.log('[MOCK] getJobs called with:', { limit, offset });
    return { jobs: [], total: 0 };
  },

  getJobById: async (jobId) => {
    console.log('[MOCK] getJobById called with:', jobId);
    return null;
  },

  createJob: async (jobData) => {
    console.log('[MOCK] createJob called with:', jobData);
    return { id: Date.now(), ...jobData };
  },

  updateJob: async (jobId, jobData) => {
    console.log('[MOCK] updateJob called with:', { jobId, jobData });
    return { id: jobId, ...jobData };
  },

  closeJob: async (jobId) => {
    console.log('[MOCK] closeJob called with:', jobId);
    return { success: true };
  },

  deleteJob: async (jobId) => {
    console.log('[MOCK] deleteJob called with:', jobId);
    return true;
  },

  getEmployerJobs: async (employerId) => {
    console.log('[MOCK] getEmployerJobs called with:', employerId);
    return [];
  },
};
