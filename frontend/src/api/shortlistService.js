// Backend integration removed - returning mock data

export const shortlistService = {
  createShortlist: async (shortlistData) => {
    console.log('[MOCK] createShortlist called with:', shortlistData);
    return { id: Date.now(), ...shortlistData };
  },

  getUserShortlist: async (userId) => {
    console.log('[MOCK] getUserShortlist called with:', userId);
    return [];
  },

  deleteShortlist: async (shortlistId) => {
    console.log('[MOCK] deleteShortlist called with:', shortlistId);
    return true;
  },
};
