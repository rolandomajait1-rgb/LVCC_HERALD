import axios from 'axios';

// Set base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.timeout = 30000;
axios.defaults.withCredentials = true; // Enable for CSRF cookies

// Add auth token and CSRF protection to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const expiresAt = localStorage.getItem('token_expires_at') || sessionStorage.getItem('token_expires_at');
    
    if (token && expiresAt && Date.now() < parseInt(expiresAt)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token && expiresAt && Date.now() >= parseInt(expiresAt)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('token_expires_at');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('token_expires_at');
    }
    
    // Add CSRF token for state-changing requests
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
      if (csrfToken) {
        config.headers['X-CSRF-TOKEN'] = csrfToken;
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
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_role');
      localStorage.removeItem('remember_me');
      sessionStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axios;
