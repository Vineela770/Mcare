// Backend integration removed
// This file is no longer needed but kept for compatibility

export default {
  get: async () => { 
    console.log('[MOCK] axios.get called'); 
    return { data: null }; 
  },
  post: async () => { 
    console.log('[MOCK] axios.post called'); 
    return { data: null }; 
  },
  put: async () => { 
    console.log('[MOCK] axios.put called'); 
    return { data: null }; 
  },
  patch: async () => { 
    console.log('[MOCK] axios.patch called'); 
    return { data: null }; 
  },
  delete: async () => { 
    console.log('[MOCK] axios.delete called'); 
    return { data: null }; 
  },
};
