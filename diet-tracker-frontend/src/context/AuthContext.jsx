// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logout } from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const data = await loginUser(credentials);
      setUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş başarısız');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const data = await registerUser(userData);
      setUser(data.user);
      setError(null);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt başarısız');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};