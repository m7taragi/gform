import React, { createContext, useContext, useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('auth_token') || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
    }
  }, [token]);

  const login = (credentialResponse) => {
    // Only storing the short-lived identity signature token client-side
    const { credential } = credentialResponse;
    if (credential) {
      setToken(credential);
    }
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy_client_id'}>
        {children}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
