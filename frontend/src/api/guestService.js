import axios from './axios';

const API_URL = '/guest';

/**
 * Submit a quick application (no registration required)
 * @param {FormData} formData - Form data including resume file
 * @returns {Promise} Response from server
 */
export const submitQuickApply = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/quick-apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit application' };
  }
};

/**
 * Submit a quick job posting (no registration required)
 * @param {Object} jobData - Job posting data
 * @returns {Promise} Response from server
 */
export const submitQuickPostJob = async (jobData) => {
  try {
    const response = await axios.post(`${API_URL}/quick-post-job`, jobData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to post job' };
  }
};

export const guestService = {
  submitQuickApply,
  submitQuickPostJob,
};
