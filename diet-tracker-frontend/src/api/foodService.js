// src/api/foodService.js
import axios from './axios';

// Besin Girişi İşlemleri
export const addFoodEntry = async (foodData) => {
  const response = await axios.post('/foods', foodData);
  return response.data;
};

export const updateFoodItem = async (id, foodData) => {
  const response = await axios.put(`/foods/${id}`, foodData);
  return response.data;
};

export const deleteFoodItem = async (id) => {
  const response = await axios.delete(`/foods/${id}`);
  return response.data;
};

// Besin Listeleme ve Arama İşlemleri
export const getDailyFoods = async (date) => {
  const response = await axios.get(`/foods/daily?date=${date}`);
  return response.data;
};

export const getFoodSummary = async (startDate, endDate) => {
  const response = await axios.get(`/foods/summary?startDate=${startDate}&endDate=${endDate}`);
  return response.data;
};

export const getWeeklyAnalysis = async (startDate) => {
  const response = await axios.get(`/foods/weekly?startDate=${startDate}`);
  return response.data;
};

export const getFrequentFoods = async (limit = 10) => {
  const response = await axios.get(`/foods/frequent?limit=${limit}`);
  return response.data;
};

export const searchFoods = async (query) => {
  const response = await axios.get(`/foods/search?query=${query}`);
  return response.data;
};