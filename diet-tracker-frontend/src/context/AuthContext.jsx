import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logout } from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    console.log('Stored User:', storedUser);
    console.log('Token:', token);
    console.log('Token Expiration:', tokenExpiration);

    // Token süresini kontrol et
    if (token && tokenExpiration && Date.now() > parseInt(tokenExpiration)) {
      console.log('Token süresi doldu, çıkış yapılıyor');
      logoutUser();
      return;
    }

    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Kullanıcı verisi çözümlenemedi:', error);
        logoutUser();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const data = await loginUser(credentials);

      if (data.token) {
        localStorage.setItem('token', data.token);
        
        const expirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiration', expirationTime.toString());
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }

      setError(null);
      return data;
    } catch (err) {
      logoutUser();
      
      setError(err.response?.data?.message || 'Giriş başarısız');
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const data = await registerUser(userData);

      if (data.token) {
        localStorage.setItem('token', data.token);
        
        const expirationTime = Date.now() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem('tokenExpiration', expirationTime.toString());
      }

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
      }

      setError(null);
      return data;
    } catch (err) {
      logoutUser();
      
      setError(err.response?.data?.message || 'Kayıt başarısız');
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiration');
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