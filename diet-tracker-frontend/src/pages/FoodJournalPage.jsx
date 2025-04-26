// src/pages/FoodJournalPage.jsx
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import AddFood from '../components/food/AddFood';
import FoodList from '../components/food/FoodList';
import { getDailyFoods } from '../api/foodService';

const FoodJournalPage = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchFoods = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await getDailyFoods(selectedDate);
      setFoods(data);
    } catch (err) {
      console.error('Besin verileri alınamadı:', err);
      setError('Besin kayıtları alınırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFoods();
  }, [selectedDate]);
  
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  
  const handleFoodAdded = () => {
    fetchFoods(); // Yeni besin eklendiğinde listeyi güncelle
  };
  
  return (
    <div className="food-journal-container">
      <h1>Besin Günlüğü</h1>
      
      <div className="date-selector">
        <label htmlFor="date">Tarih:</label>
        <input
          type="date"
          id="date"
          name="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      
      <AddFood selectedDate={selectedDate} onFoodAdded={handleFoodAdded} />
      
      {isLoading ? (
        <div className="loading">Yükleniyor...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <FoodList foods={foods} onFoodDeleted={fetchFoods} />
      )}
    </div>
  );
};

export default FoodJournalPage;