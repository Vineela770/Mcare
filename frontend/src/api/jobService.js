import axios from './axios';

export const jobService = {
  // Get all jobs with optional filters
  getJobs: async (params = {}) => {
    try {
      const response = await axios.get('/jobs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Get single job by ID
  getJobById: async (jobId) => {
    try {
      const response = await axios.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job:', error);
      throw error;
    }
  },

  // Create new job (requires authentication)
  createJob: async (jobData) => {
    try {
      const response = await axios.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  // Update existing job (requires authentication)
  updateJob: async (jobId, jobData) => {
    try {
      const response = await axios.put(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  // Close a job posting (requires authentication)
  closeJob: async (jobId) => {
    try {
      const response = await axios.patch(`/jobs/${jobId}/close`);
      return response.data;
    } catch (error) {
      console.error('Error closing job:', error);
      throw error;
    }
  },

  // Delete a job (requires authentication)
  deleteJob: async (jobId) => {
    try {
      await axios.delete(`/jobs/${jobId}`);
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  },

  // Get jobs posted by specific employer (requires authentication)
  getEmployerJobs: async (employerId) => {
    try {
      const response = await axios.get(`/jobs/employer/${employerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employer jobs:', error);
      throw error;
    }
  },

  // Save a job (requires authentication)
  saveJob: async (jobId) => {
    try {
      const response = await axios.post('/candidate/saved-jobs', { job_id: jobId });
      return response.data;
    } catch (error) {
      console.error('Error saving job:', error);
      throw error;
    }
  },

  // Get saved jobs (requires authentication)
  getSavedJobs: async () => {
    try {
      const response = await axios.get('/candidate/saved-jobs');
      return response.data;
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      throw error;
    }
  },

  // Unsave a job (requires authentication)
  unsaveJob: async (jobId) => {
    try {
      await axios.delete(`/candidate/saved-jobs/${jobId}`);
      return true;
    } catch (error) {
      console.error('Error unsaving job:', error);
      throw error;
    }
  },
};

