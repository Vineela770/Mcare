import api from './axios';

const contactService = {
  /**
   * Submit contact form
   * @param {Object} formData - { name, email, subject, message }
   */
  submitContactForm: async (formData) => {
    const response = await api.post('/support/contact', formData);
    return response.data;
  },

  /**
   * Get FAQs
   */
  getFAQs: async () => {
    const response = await api.get('/support/faqs');
    return response.data;
  }
};

export default contactService;
