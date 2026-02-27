// Backend integration removed - returning mock data

export const authService = {
  // REGISTER
  register: async (userData) => {
    console.log('[MOCK] register called with:', userData);
    return { message: 'Registration successful' };
  },

  // LOGIN
  login: async (email, password) => {
    console.log('[MOCK] login called with:', { email, password });
    
    const mockToken = 'mock-jwt-token-' + Date.now();
    const mockUser = {
      id: 1,
      email: email,
      name: 'Mock User',
      role: 'candidate'
    };

    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(mockUser));

    return { token: mockToken, user: mockUser };
  },

  // FORGOT PASSWORD
  forgotPassword: async (email) => {
    console.log('[MOCK] forgotPassword called with:', email);
    return { message: 'Password reset link sent' };
  },

  // RESET PASSWORD
  resetPassword: async (token, newPassword) => {
    console.log('[MOCK] resetPassword called with:', { token, newPassword });
    return { message: 'Password reset successful' };
  },

  // AUTH HELPERS
  getToken: () => localStorage.getItem("token"),

  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => !!localStorage.getItem("token"),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
