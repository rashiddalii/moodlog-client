import { useCallback } from 'react';
import { toast } from 'react-toastify';

export const useApiError = () => {
  const handleError = useCallback((error, context = '') => {
    console.error(`${context} Error:`, error);

    // Handle different error types
    if (error.type === 'NETWORK_ERROR') {
      toast.error('Network error. Please check your connection and try again.');
      return;
    }

    if (error.type === 'SERVER_ERROR') {
      toast.error('Server error. Please try again later.');
      return;
    }

    if (error.status === 401) {
      toast.error('Session expired. Please log in again.');
      return;
    }

    if (error.status === 403) {
      toast.error('Access denied. You don\'t have permission to perform this action.');
      return;
    }

    if (error.status === 404) {
      toast.error('Resource not found.');
      return;
    }

    if (error.status === 422) {
      // Validation errors
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => {
          toast.error(`${err.field}: ${err.message}`);
        });
        return;
      }
    }

    if (error.status === 429) {
      toast.error('Too many requests. Please slow down and try again.');
      return;
    }

    // Default error message
    const message = error.message || 'An unexpected error occurred. Please try again.';
    toast.error(message);
  }, []);

  const handleSuccess = useCallback((message) => {
    toast.success(message);
  }, []);

  const handleWarning = useCallback((message) => {
    toast.warning(message);
  }, []);

  const handleInfo = useCallback((message) => {
    toast.info(message);
  }, []);

  return {
    handleError,
    handleSuccess,
    handleWarning,
    handleInfo
  };
};

