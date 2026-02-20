// Backend integration removed - returning mock data

export const followService = {
  follow: async (followData) => {
    console.log('[MOCK] follow called with:', followData);
    return { id: Date.now(), ...followData };
  },

  getUserFollows: async (userId) => {
    console.log('[MOCK] getUserFollows called with:', userId);
    return [];
  },

  unfollow: async (userId, employerId) => {
    console.log('[MOCK] unfollow called with:', { userId, employerId });
    return true;
  },
};
