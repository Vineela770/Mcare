import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

/**
 * 🛰️ AXIOS INSTANCE
 * Creates a reusable instance for all API calls.
 */
const api = axios.create({
    baseURL: API_URL,
});

/**
 * 🛡️ REQUEST INTERCEPTOR
 * Automatically attaches the Bearer token to every request if it exists.
 */
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

/**
 * Handles communication between the React frontend and the Node.js backend
 */
export const authService = {
    // 📝 REGISTER
    register: async (formData) => {
        const response = await api.post('/auth/register', formData);
        return response.data;
    },

    // 🔑 LOGIN
    login: async (loginData) => {
        const response = await api.post('/auth/login', loginData);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // 📊 DASHBOARD STATS
    getDashboardStats: async () => {
        // No need to manually add headers now! Interceptor handles it.
        const response = await api.get('/candidate/dashboard-stats');
        return response.data;
    },

    // 🛠️ AUTH HELPERS
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