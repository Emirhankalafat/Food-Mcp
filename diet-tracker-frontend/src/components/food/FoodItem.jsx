// src/components/food/FoodItem.jsx
import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { deleteFoodItem, updateFoodItem } from '../../api/foodService';

const FoodItem = ({ food, onDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: food.name,
    calories: food.calories,
    quantity: food.quantity,
    unit: food.unit
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const value = e.target.name === 'calories' || e.target.name === 'quantity'
      ? parseFloat(e.target.value)
      : e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsLoading(true);
      await updateFoodItem(food.id, formData);
      setIsEditing(false);
      if (onDeleted) onDeleted(); // Listeyi yenile
    } catch (err) {
      console.error('Besin güncelleme hatası:', err);
      setError(err.response?.data?.message || 'Besin güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm('Bu besini silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      await deleteFoodItem(food.id);
      if (onDeleted) onDeleted(); // Listeyi yenile
    } catch (err) {
      console.error('Besin silme hatası:', err);
      alert(err.response?.data?.message || 'Besin silinirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="food-item">
      {error && <p className="error">{error}</p>}
      
      {isEditing ? (
        <form onSubmit={handleUpdate} className="food-edit-form">
          <div className="form-row">
            <div className="form-group">
              <label>Besin</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Kalori</label>
              <input
                type="number"
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Miktar</label>
              <input
                type="number"
                name="quantity"
                step="0.1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Birim</label>
              <select
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
          
          <div className="form-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="cancel-btn"
              disabled={isLoading}
            >
              İptal
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="food-details">
            <h4 className="food-name">{food.name}</h4>
            <div className="food-quantity">
              {food.quantity} {food.unit}
            </div>
            <div className="food-calories">
              {food.calories} kcal
            </div>
          </div>
          
          <div className="food-actions">
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-btn"
              disabled={isLoading}
            >
              <FaEdit />
            </button>
            <button 
              onClick={handleDelete}
              className="delete-btn"
              disabled={isLoading}
            >
              <FaTrash />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FoodItem;