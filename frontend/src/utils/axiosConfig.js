import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL || 'https://lvcc-herald.onrender.com';
const normalizedBase = rawBase.replace(/\/+$/, '').replace(/\/api$/, '');
axios.defaults.baseURL = normalizedBase;
axios.defaults.timeout = 15000;
axios.defaults.withCredentials = false;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add auth token and CSRF protection to requests
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        const expiresAt = localStorage.getItem('token_expires_at') || sessionStorage.getItem('token_expires_at');

        if (token) {
            if (expiresAt && Date.now() >= parseInt(expiresAt)) {
                // Token expired, clear storage
                localStorage.removeItem('auth_token');
                localStorage.removeItem('token_expires_at');
                localStorage.removeItem('user_email');
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_role');
                sessionStorage.removeItem('auth_token');
                sessionStorage.removeItem('token_expires_at');
                window.dispatchEvent(new Event('authChange'));
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        config.headers['X-Requested-With'] = 'XMLHttpRequest';
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle responses and errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
            console.error('Network error:', error.message);
        }
        if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_name');
            localStorage.removeItem('user_role');
            localStorage.removeItem('remember_me');
            sessionStorage.clear();
            window.location.href = '/landing';
        }
        
        if (error.response?.status === 403) {
            console.error('Access forbidden - insufficient permissions');
        }
        
        if (error.response?.status >= 500) {
            console.error('Server error - please try again later');
        }
        return Promise.reject(error);
    }
);

export default axios;