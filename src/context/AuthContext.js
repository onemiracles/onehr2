import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import { useCookies } from 'react-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['authToken']);

  const login = useCallback(async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const userData = {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
        tenantId: response.user.tenantId,
        token: response.accessToken,
      };
      setUser(userData);
      setCookie('authToken', response.accessToken, { path: '/', maxAge: 2592000 });
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [setCookie]);

  const logout = useCallback(() => {
    setUser(null);
    removeCookie('authToken', { path: '/' });
    authService.logout();
  }, [removeCookie]);

  const checkAuth = useCallback(async () => {
    if (cookies.authToken) {
      try {
        const userData = await authService.validateToken();
        setUser(userData);
      } catch (error) {
        console.error('Token validation failed:', error);
        logout();
      }
    }
    setLoading(false);
  }, [cookies.authToken, logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    user,
    login,
    logout,
    checkAuth,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};