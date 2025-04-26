// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { getUserProfile, updateUserProfile } from '../api/userService';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    weight: '',
    height: '',
    gender: '',
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        setUser(data);
        setFormData({
          name: data.name,
          weight: data.weight,
          height: data.height,
          gender: data.gender,
        });
      } catch (err) {
        console.error('Profil bilgisi alınamadı:', err);
        setError('Profil bilgileri alınırken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (authUser) {
      fetchProfile();
    }
  }, [authUser]);
  
  const handleChange = (e) => {
    const value = e.target.name === 'weight' || e.target.name === 'height'
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
      setIsLoading(true);
      const updatedUser = await updateUserProfile(formData);
      setUser(updatedUser.user);
      setIsEditing(false);
    } catch (err) {
      console.error('Profil güncelleme hatası:', err);
      setError(err.response?.data?.message || 'Profil güncellenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !user) {
    return <div className="loading">Yükleniyor...</div>;
  }
  
  if (error && !user) {
    return <div className="error-message">{error}</div>;
  }
  
  // BMI hesaplama
  const calculateBMI = () => {
    if (!user.height || !user.weight) return null;
    
    const heightInMeters = user.height / 100;
    const bmi = user.weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(1);
  };
  
  const getBMICategory = (bmi) => {
    if (!bmi) return '';
    
    if (bmi < 18.5) return 'Zayıf';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Fazla Kilolu';
    return 'Obez';
  };
  
  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  
  // src/pages/ProfilePage.jsx (devamı)
  return (
    <div className="profile-container">
      <h1>Profil</h1>
      
      {error && <p className="error">{error}</p>}
      
      {isEditing ? (
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
          
          <div className="form-group">
            <label htmlFor="weight">Kilo (kg)</label>
            <input
              type="number"
              id="weight"
              name="weight"
              step="0.1"
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
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="profile-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="cancel-btn"
            >
              İptal
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-info">
          <div className="profile-detail">
            <span className="label">İsim:</span>
            <span className="value">{user.name}</span>
          </div>
          
          <div className="profile-detail">
            <span className="label">E-posta:</span>
            <span className="value">{user.email}</span>
          </div>
          
          <div className="profile-detail">
            <span className="label">Cinsiyet:</span>
            <span className="value">
              {user.gender === 'erkek' ? 'Erkek' : 'Kadın'}
            </span>
          </div>
          
          <div className="profile-detail">
            <span className="label">Kilo:</span>
            <span className="value">{user.weight} kg</span>
          </div>
          
          <div className="profile-detail">
            <span className="label">Boy:</span>
            <span className="value">{user.height} cm</span>
          </div>
          
          {bmi && (
            <div className="profile-bmi">
              <div className="bmi-value">
                <span className="label">BMI:</span>
                <span className="value">{bmi}</span>
              </div>
              <div className="bmi-category">
                <span className="label">Durum:</span>
                <span className={`value bmi-${bmiCategory.toLowerCase().replace(' ', '-')}`}>
                  {bmiCategory}
                </span>
              </div>
            </div>
          )}
          
          <button 
            onClick={() => setIsEditing(true)}
            className="edit-btn"
          >
            Profili Düzenle
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;