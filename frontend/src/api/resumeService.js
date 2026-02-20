// Backend integration removed - returning mock data

export const resumeService = {
  uploadResume: async (file, userId) => {
    console.log('[MOCK] uploadResume called with:', { fileName: file.name, userId });
    return { 
      id: Date.now(), 
      userId, 
      fileName: file.name, 
      fileUrl: '#' 
    };
  },

  getUserResumes: async (userId) => {
    console.log('[MOCK] getUserResumes called with:', userId);
    return [];
  },

  deleteResume: async (resumeId) => {
    console.log('[MOCK] deleteResume called with:', resumeId);
    return true;
  },

  downloadResume: (resumeUrl) => {
    console.log('[MOCK] downloadResume called with:', resumeUrl);
  },
};
