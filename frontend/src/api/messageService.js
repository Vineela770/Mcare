import axios from './axios';

export const messageService = {
  // Send a message
  sendMessage: async (messageData) => {
    try {
      const response = await axios.post('/api/messages', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send message' };
    }
  },

  // Get user messages
  getUserMessages: async () => {
    try {
      const response = await axios.get('/api/messages');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch messages' };
    }
  },
};
