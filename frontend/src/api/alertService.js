// Backend integration removed - returning mock data

export const alertService = {
  createAlert: async (alertData) => {
    console.log('[MOCK] createAlert called with:', alertData);
    return { id: Date.now(), ...alertData };
  },

  getUserAlerts: async (userId) => {
    console.log('[MOCK] getUserAlerts called with:', userId);
    return [];
  },

  updateAlert: async (alertId, alertData) => {
    console.log('[MOCK] updateAlert called with:', { alertId, alertData });
    return { id: alertId, ...alertData };
  },

  deleteAlert: async (alertId) => {
    console.log('[MOCK] deleteAlert called with:', alertId);
    return true;
  },
};
