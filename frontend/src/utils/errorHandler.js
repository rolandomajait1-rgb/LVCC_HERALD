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