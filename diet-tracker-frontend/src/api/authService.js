// src/api/authService.js
import axios from './axios';

export const registerUser = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};