import axios from './axios';

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch dashboard stats' };
    }
  },

  // Users Management
  getUsers: async () => {
    try {
      const response = await axios.get('/api/admin/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user details' };
    }
  },

  createUser: async (userData) => {
    try {
      const response = await axios.post('/api/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`/api/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  // Jobs Management
  getJobs: async () => {
    try {
      const response = await axios.get('/api/admin/jobs');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch jobs' };
    }
  },

  updateJob: async (id, jobData) => {
    try {
      const response = await axios.put(`/api/admin/jobs/${id}`, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update job' };
    }
  },

  deleteJob: async (id) => {
    try {
      const response = await axios.delete(`/api/admin/jobs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete job' };
    }
  },

  // Employers Management
  getEmployers: async () => {
    try {
      const response = await axios.get('/api/admin/employers');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employers' };
    }
  },

  createEmployer: async (employerData) => {
    try {
      const response = await axios.post('/api/admin/employers', employerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create employer' };
    }
  },

  getEmployerById: async (id) => {
    try {
      const response = await axios.get(`/api/admin/employers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch employer' };
    }
  },

  updateEmployer: async (id, employerData) => {
    try {
      const response = await axios.put(`/api/admin/employers/${id}`, employerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update employer' };
    }
  },

  deleteEmployer: async (id) => {
    try {
      const response = await axios.delete(`/api/admin/employers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete employer' };
    }
  },

  // Activity Log
  getActivities: async () => {
    try {
      const response = await axios.get('/api/admin/activity');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch activities' };
    }
  },

  getActivityStats: async () => {
    try {
      const response = await axios.get('/api/admin/activity/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch activity stats' };
    }
  },

  // Reports
  getReportStats: async () => {
    try {
      const response = await axios.get('/api/admin/reports/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch report stats' };
    }
  },

  generateUserReport: async (reportData) => {
    try {
      const response = await axios.post('/api/admin/reports/generate-user', reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate report' };
    }
  },

  // System Settings
  getSettings: async () => {
    try {
      const response = await axios.get('/api/admin/settings');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch settings' };
    }
  },

  updateSettings: async (settings) => {
    try {
      const response = await axios.put('/api/admin/settings', settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update settings' };
    }
  },
};

export default adminService;
