// Backend integration removed - returning mock data

export const messageService = {
  sendMessage: async (messageData) => {
    console.log('[MOCK] sendMessage called with:', messageData);
    return { id: Date.now(), ...messageData, sentAt: new Date().toISOString() };
  },

  getUserMessages: async (userId) => {
    console.log('[MOCK] getUserMessages called with:', userId);
    return [];
  },
};
