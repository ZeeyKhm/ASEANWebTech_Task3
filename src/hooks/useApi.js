import { useState, useCallback } from 'react';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiCall();
      setLoading(false);
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMsg);
      setLoading(false);
      return { success: false, error: err, message: errorMsg };
    }
  }, []);

  return { loading, error, execute, setError };
}
