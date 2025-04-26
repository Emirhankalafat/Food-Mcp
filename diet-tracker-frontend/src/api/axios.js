// src/api/axios.js
import axios from 'axios';

const baseURL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Her istekte token kontrolü
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Token'ın geçerli olup olmadığını kontrol et
      const tokenExpiration = localStorage.getItem('tokenExpiration');
      if (tokenExpiration && Date.now() > parseInt(tokenExpiration)) {
        // Token süresi dolmuşsa localStorage'dan temizle
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');
        window.location.href = '/login'; // Login sayfasına yönlendir
        return config;
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;