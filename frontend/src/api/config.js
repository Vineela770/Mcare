// Backend integration removed
// This configuration file is no longer used but kept for compatibility

export const API_CONFIG = {
  BASE_URL: '',
  ENDPOINTS: {}
};

// Helper to get authorization headers (mock)
export const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

// Helper for file upload headers (mock)
export const getFileUploadHeaders = () => {
  return {};
};

// Helper for making API requests (mock)
export const apiRequest = async (url, options = {}) => {
  console.log('[MOCK] apiRequest called with:', { url, options });
  return { success: true };
};

export default API_CONFIG;
