// src/components/profile/UpdateProfile.jsx
import React, { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import { updateUserProfile } from '../../api/userService';

const UpdateProfile = ({ user, onUpdateSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    gender: user.gender || 'erkek',
    weight: user.weight || '',
    height: user.height || ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const value = e.target.name === 'weight' || e.target.name === 'height'
      ? parseFloat(e.target.value)
      : e.target.value;
    
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      setIsLoading(true);
      const result = await updateUserProfile(formData);
      if (onUpdateSuccess) {
        onUpdateSuccess(result.user);
      }
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
      setError(err.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="update-profile-container">
      <h2>Profil Bilgilerini Güncelle</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="name">İsim</label>
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
          <label htmlFor="gender">Cinsiyet</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="erkek">Erkek</option>
            <option value="kadın">Kadın</option>
          </select>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="weight">Kilo (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              step="0.1"
              min="30"
              max="300"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="height">Boy (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              min="100"
              max="250"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isLoading}
          >
            <FaSave /> {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            <FaTimes /> İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;