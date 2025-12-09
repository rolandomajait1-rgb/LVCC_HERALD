// Error handling utilities

export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 404:
        return {
          title: 'Not Found',
          message: data.message || 'The requested resource was not found.',
          type: 'error'
        };
      case 401:
        return {
          title: 'Unauthorized',
          message: 'Please log in to access this resource.',
          type: 'error'
        };
      case 403:
        return {
          title: 'Access Denied',
          message: 'You do not have permission to access this resource.',
          type: 'error'
        };
      case 422:
        return {
          title: 'Validation Error',
          message: data.message || 'Please check your input and try again.',
          type: 'error'
        };
      case 500:
        return {
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later.',
          type: 'error'
        };
      default:
        return {
          title: 'Error',
          message: data.message || 'An unexpected error occurred.',
          type: 'error'
        };
    }
  } else if (error.request) {
    // Network error
    return {
      title: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      type: 'error'
    };
  } else {
    // Other error
    return {
      title: 'Error',
      message: error.message || 'An unexpected error occurred.',
      type: 'error'
    };
  }
};

export const handleApiError = (error, showNotification) => {
  const errorInfo = getErrorMessage(error);
  if (showNotification) {
    showNotification(errorInfo.title, errorInfo.message, errorInfo.type);
  }
  return errorInfo;
};