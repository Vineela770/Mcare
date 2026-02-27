import axios from './axios';

export const resumeService = {
  // Upload resume file
  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await axios.post('/api/candidate/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to upload resume' };
    }
  },

  // Get user's resume data
  getUserResume: async () => {
    try {
      const response = await axios.get('/api/candidate/resume');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch resume' };
    }
  },

  // Update resume data
  updateResume: async (resumeData) => {
    try {
      const response = await axios.put('/api/candidate/resume', resumeData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update resume' };
    }
  },

  // Download resume
  downloadResume: (resumeUrl) => {
    // Get the API base URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    // Open resume in new tab
    window.open(`${API_URL}${resumeUrl}`, '_blank');
  },
};
