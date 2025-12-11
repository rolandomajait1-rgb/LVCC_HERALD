// API error handler function
export const handleApiError = (error, showNotification) => {
  console.error('API Error:', error);
  
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';
    
    if (status === 401) {
      showNotification('Authentication Error', 'Please login to continue', 'error');
      return { message: 'Authentication required' };
    } else if (status === 403) {
      showNotification('Access Denied', 'You do not have permission to perform this action', 'error');
      return { message: 'Access denied' };
    } else if (status === 404) {
      showNotification('Not Found', 'The requested resource was not found', 'error');
      return { message: 'Resource not found' };
    } else if (status >= 500) {
      showNotification('Server Error', 'A server error occurred. Please try again later.', 'error');
      return { message: 'Server error' };
    } else {
      showNotification('Error', message, 'error');
      return { message };
    }
  } else if (error.request) {
    showNotification('Network Error', 'Unable to connect to server. Please check your connection.', 'error');
    return { message: 'Network error' };
  } else {
    showNotification('Error', 'An unexpected error occurred', 'error');
    return { message: 'Unexpected error' };
  }
};

// Global error handler to suppress React DevTools errors
const originalConsoleError = console.error;

console.error = (...args) => {
  const message = args[0];
  
  // Suppress React DevTools related errors
  if (typeof message === 'string') {
    if (
      message.includes('installHook.js') ||
      message.includes('Server error - please try again later') ||
      message.includes('overrideMethod') ||
      message.includes('react-devtools')
    ) {
      return; // Suppress these errors
    }
  }
  
  // Allow all other errors to be logged
  originalConsoleError.apply(console, args);
};

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;
  if (error && typeof error.message === 'string') {
    if (
      error.message.includes('installHook.js') ||
      error.message.includes('react-devtools') ||
      error.message.includes('Server error - please try again later')
    ) {
      event.preventDefault(); // Suppress the error
      return;
    }
  }
});

export default {};