/**
 * CSRF Token Utility
 * Provides functions to get and manage CSRF tokens for API requests
 */

export const getCsrfToken = () => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return token || '';
};

export const csrfHeaders = () => ({
  'X-CSRF-TOKEN': getCsrfToken(),
  'X-Requested-With': 'XMLHttpRequest'
});

export const initCsrfToken = () => {
  // This would be called on app initialization
  // In a Laravel + React setup, the token would be embedded in the HTML
  const token = getCsrfToken();
  if (!token) {
    console.warn('CSRF token not found. Ensure meta tag is present in HTML.');
  }
  return token;
};
