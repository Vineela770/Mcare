import axios from './axios';

export const jobService = {
  // Get all jobs (public)
  getJobs: async (params = {}) => {
    try {
      const response = await axios.get('/api/jobs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch jobs' };
    }
  },

  // Get single job by ID (public)
  getJobById: async (jobId) => {
    try {
      const response = await axios.get(`/api/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job details' };
    }
  },

  // Get all jobs for candidates (with auth)
  getCandidateJobs: async (params = {}) => {
    try {
      const response = await axios.get('/api/candidate/jobs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch jobs' };
    }
  },

  // Get job details for candidates (with auth)
  getCandidateJobById: async (jobId) => {
    try {
      const response = await axios.get(`/api/candidate/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job details' };
    }
  },

  // Apply to a job
  applyToJob: async (jobData) => {
    try {
      const response = await axios.post('/api/candidate/jobs/apply', jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to apply for job' };
    }
  },

  // Save a job
  saveJob: async (jobId) => {
    try {
      const response = await axios.post('/api/candidate/saved-jobs', { jobId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to save job' };
    }
  },

  // Get saved jobs
  getSavedJobs: async () => {
    try {
      const response = await axios.get('/api/candidate/saved-jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch saved jobs' };
    }
  },

  // Remove saved job
  deleteSavedJob: async (savedJobId) => {
    try {
      const response = await axios.delete(`/api/candidate/saved-jobs/${savedJobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to remove saved job' };
    }
  },

  // Search hospitals
  searchHospitals: async (query) => {
    try {
      const response = await axios.get('/api/candidate/search/hospitals', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search hospitals' };
    }
  },
};

export default jobService;
