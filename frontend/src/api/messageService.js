import axios from './axios';

export const messageService = {
  // Search HR contacts to start a new conversation
  searchContacts: async (q = '') => {
    try {
      const response = await axios.get('/api/candidate/messages/search', { params: { q } });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to search contacts' };
    }
  },

  // Get all conversations for the logged-in candidate
  getConversations: async () => {
    try {
      const response = await axios.get('/api/candidate/messages/conversations');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch conversations' };
    }
  },

  // Get chat history with a specific user
  getChatHistory: async (otherUserId) => {
    try {
      const response = await axios.get(`/api/candidate/messages/history/${otherUserId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch messages' };
    }
  },

  // Send a message to a specific receiver
  sendMessage: async (receiverId, messageText) => {
    try {
      const response = await axios.post('/api/candidate/messages/send', {
        receiver_id: receiverId,
        message_text: messageText,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send message' };
    }
  },
};

