// src/components/food/AddFood.jsx
import React, { useState } from 'react';
import { addFoodEntry } from '../../api/foodService';

const AddFood = ({ selectedDate, onFoodAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    quantity: '',
    unit: 'adet',
    mealType: 'kahvaltı',
    date: selectedDate,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const value = e.target.name === 'calories' || e.target.name === 'quantity'
      ? parseFloat(e.target.value)
      : e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsSubmitting(true);
      await addFoodEntry({
        ...formData,
        date: selectedDate,
      });
      
      // Formu sıfırla
      setFormData({
        name: '',
        calories: '',
        quantity: '',
        unit: 'adet',
        mealType: 'kahvaltı',
        date: selectedDate,
      });
      
      if (onFoodAdded) {
        onFoodAdded();
      }
    } catch (err) {
      console.error('Besin ekleme hatası:', err);
      setError(err.response?.data?.message || 'Besin eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="add-food-container">
      <h2>Yeni Besin Ekle</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Besin Adı</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="calories">Kalori</label>
            <input
              type="number"
              id="calories"
              name="calories"
              value={formData.calories}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="quantity">Miktar</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              step="0.1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="unit">Birim</label>
            <select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              <option value="adet">Adet</option>
              <option value="gram">Gram</option>
              <option value="ml">ml</option>
              <option value="porsiyon">Porsiyon</option>
              <option value="dilim">Dilim</option>
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="mealType">Öğün</label>
          <select
            id="mealType"
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
          >
            <option value="kahvaltı">Kahvaltı</option>
            <option value="öğlen">Öğle Yemeği</option>
            <option value="akşam">Akşam Yemeği</option>
            <option value="ara öğün">Ara Öğün</option>
          </select>
        </div>
        
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Ekleniyor...' : 'Ekle'}
        </button>
      </form>
    </div>
  );
};

export default AddFood;