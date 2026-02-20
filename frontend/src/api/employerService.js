// Backend integration removed - returning mock data

export const employerService = {
  createProfile: async (userId, employerData) => {
    console.log('[MOCK] createProfile called with:', { userId, employerData });
    return { id: Date.now(), userId, ...employerData };
  },

  getProfileByUserId: async (userId) => {
    console.log('[MOCK] getProfileByUserId called with:', userId);
    return null;
  },

  getProfileById: async (employerId) => {
    console.log('[MOCK] getProfileById called with:', employerId);
    return null;
  },

  updateProfile: async (userId, employerData) => {
    console.log('[MOCK] updateProfile called with:', { userId, employerData });
    return { userId, ...employerData };
  },
};
