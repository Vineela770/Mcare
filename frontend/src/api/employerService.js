import axios from './axios';

export const employerService = {
  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await axios.get('/api/hr/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
    }
  },

  getRecentApplications: async () => {
    try {
      const response = await axios.get('/api/hr/dashboard/recent-applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch recent applications' };
    }
  },

  // Jobs
  getJobs: async () => {
    try {
      const response = await axios.get('/api/hr/jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch jobs' };
    }
  },

  getJobById: async (jobId) => {
    try {
      const response = await axios.get(`/api/hr/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch job details' };
    }
  },

  deleteJob: async (jobId) => {
    try {
      const response = await axios.delete(`/api/hr/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete job' };
    }
  },

  // Applications
  getApplications: async () => {
    try {
      const response = await axios.get('/api/hr/applications');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch applications' };
    }
  },

  updateApplicationStatus: async (applicationId, status) => {
    try {
      const response = await axios.put(`/api/hr/applications/${applicationId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update application status' };
    }
  },

  // Profile
  createProfile: async (employerData) => {
    try {
      const response = await axios.post('/api/employer/profile', employerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create employer profile' };
    }
  },

  // Get employer profile by user ID
  getProfileByUserId: async () => {
    try {
      const response = await axios.get('/api/employer/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employer profile' };
    }
  },

  // Get employer profile by ID
  getProfileById: async (employerId) => {
    try {
      const response = await axios.get(`/api/employer/${employerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employer details' };
    }
  },

  // Update employer profile
  updateProfile: async (employerData) => {
    try {
      const response = await axios.put('/api/employer/profile', employerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update employer profile' };
    }
  },

  // Get candidates
  getCandidates: async () => {
    try {
      const response = await axios.get('/api/hr/candidates');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch candidates' };
    }
  },

  // Update candidate status
  updateCandidateStatus: async (id, status) => {
    try {
      const response = await axios.put(`/api/hr/candidates/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update candidate status' };
    }
  },

  // Get interviews
  getInterviews: async () => {
    try {
      const response = await axios.get('/api/hr/interviews');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch interviews' };
    }
  },

  // Create interview
  createInterview: async (interviewData) => {
    try {
      const response = await axios.post('/api/hr/interviews', interviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create interview' };
    }
  },

  // Update interview
  updateInterview: async (id, interviewData) => {
    try {
      const response = await axios.put(`/api/hr/interviews/${id}`, interviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update interview' };
    }
  },

  // Get conversations (messages)
  getConversations: async () => {
    try {
      const response = await axios.get('/api/hr/messages/conversations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch conversations' };
    }
  },

  // Get messages by conversation ID
  getMessages: async (conversationId) => {
    try {
      const response = await axios.get(`/api/hr/messages/conversation/${conversationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch messages' };
    }
  },

  // Send message
  sendMessage: async (messageData) => {
    try {
      const response = await axios.post('/api/hr/messages/send', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send message' };
    }
  },

  // Get HR profile
  getProfile: async () => {
    try {
      const response = await axios.get('/api/hr/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch profile' };
    }
  },

  // Save/Update HR profile
  saveProfile: async (profileData) => {
    try {
      const response = await axios.post('/api/hr/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to save profile' };
    }
  },
};
