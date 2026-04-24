import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../api/client';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      // Fetch current user to verify token is still valid
      authAPI
        .me()
        .then((res) => {
          setUser(res.data.data);
          localStorage.setItem('user', JSON.stringify(res.data.data));
        })
        .catch(() => {
          // Token invalid, clear it
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password, passwordConfirmation) => {
    setError(null);
    try {
      const res = await authAPI.register(name, email, password, passwordConfirmation);
      // Handle different response structures
      const responseData = res.data.data || res.data;
      const { token: newToken, user: newUser } = responseData;

      if (!newToken || !newUser) {
        throw new Error('Invalid response structure from API');
      }

      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: err, fieldErrors: err.response?.data?.data };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login(email, password);
      // Handle different response structures
      const responseData = res.data.data || res.data;
      const { token: newToken, user: newUser } = responseData;

      if (!newToken || !newUser) {
        throw new Error('Invalid response structure from API');
      }

      localStorage.setItem('auth_token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: err, fieldErrors: err.response?.data?.data };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
      setError(null);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    register,
    login,
    logout,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
