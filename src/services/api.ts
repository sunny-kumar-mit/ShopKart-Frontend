import axios from 'axios';

// Create a centralized API instance
// Base URL is strictly from environment variable without fallback to localhost
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // Enable sending cookies/credentials
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
    (config) => {
        try {
            const storage = localStorage.getItem('auth-storage');
            if (storage) {
                const parsed = JSON.parse(storage);
                const token = parsed.state?.user?.token;
                if (token) {
                    config.headers['x-auth-token'] = token;
                }
            }
        } catch (error) {
            console.error("Error reading token for API header", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Extract error message from backend response if available
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        // Reject with a standard Error object containing the message
        return Promise.reject(new Error(message));
    }
);

export default api;
