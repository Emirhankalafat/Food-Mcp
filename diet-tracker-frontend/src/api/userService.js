import axios from './axios';

export const getUserProfile = async () => {
  const response = await axios.get('/users/profile');
  return response.data;
};

export const updateUserProfile = async (userData) => {
  const response = await axios.put('/users/profile', userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await axios.put('/users/change-password', passwordData);
  return response.data;
};

export const deleteAccount = async (passwordData) => {
  const response = await axios.delete('/users/account', { data: passwordData });
  return response.data;
};

export const getUserStats = async () => {
  const response = await axios.get('/users/stats');
  return response.data;
};