// Backend integration removed - returning mock data

export const userService = {
  getProfile: async (userId) => {
    console.log('[MOCK] getProfile called with:', userId);
    return { id: userId, name: 'Mock User', email: 'user@example.com' };
  },

  updateProfile: async (userId, profileData) => {
    console.log('[MOCK] updateProfile called with:', { userId, profileData });
    return { id: userId, ...profileData };
  },

  changePassword: async (userId, passwordData) => {
    console.log('[MOCK] changePassword called with:', { userId, passwordData });
    return { message: 'Password changed successfully' };
  },

  getDashboardStats: async (userId) => {
    console.log('[MOCK] getDashboardStats called with:', userId);
    return { 
      applications: 0, 
      shortlisted: 0, 
      interviews: 0, 
      following: 0 
    };
  },

  deleteAccount: async (userId) => {
    console.log('[MOCK] deleteAccount called with:', userId);
    return true;
  },
};
