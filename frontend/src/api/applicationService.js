import axios from './axios';

export const applicationService = {
  // Get user's applications
  getUserApplications: async () => {
    try {
      const response = await axios.get('/api/candidate/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications' };
    }
  },

  // Get single application details
  getApplicationDetails: async (applicationId) => {
    try {
      const response = await axios.get(`/api/candidate/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch application details' };
    }
  },

  // Create new application (apply to job)
  createApplication: async (applicationData) => {
    try {
      const response = await axios.post('/api/candidate/jobs/apply', applicationData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit application' };
    }
  },

  // Get applications for a specific job (for HR/admin)
  getJobApplications: async (jobId) => {
    try {
      const response = await axios.get(`/api/applications/job/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job applications' };
    }
  },

  // Update application status (for HR/admin)
  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await axios.put(`/api/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update application status' };
    }
  },

  // Get application statistics (for HR/admin)
  getApplicationStats: async (jobId) => {
    try {
      const response = await axios.get(`/api/applications/stats/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch application stats' };
    }
  },
};
