// src/components/profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { FaEdit } from 'react-icons/fa';
import { getUserProfile } from '../../api/userService';
import UpdateProfile from './UpdateProfile';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        setError('Profil bilgileri alınırken bir hata oluştu');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateSuccess = async () => {
    try {
      const freshData = await getUserProfile();  // API'den tekrar tam veriyi çekiyoruz
      setUser(freshData);
      setIsEditing(false);
      setSuccessMessage('Profil başarıyla güncellendi');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Profil güncellemesi sonrası veri çekilemedi', error);
    }
  };
  

  const handleCopyApiKey = () => {
    if (user?.api_key) {
      navigator.clipboard.writeText(user.api_key);
      setSuccessMessage('API anahtarı kopyalandı!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const calculateBMI = () => {
    if (!user?.height || !user?.weight) return null;
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

  const getBMICategoryClass = (category) => {
    switch (category.toLowerCase()) {
      case 'zayıf': return 'bmi-zayif';
      case 'normal': return 'bmi-normal';
      case 'fazla kilolu': return 'bmi-fazla-kilolu';
      case 'obez': return 'bmi-obez';
      default: return '';
    }
  };

  if (isLoading) {
    return <div className="loading">Profil bilgileri yükleniyor...</div>;
  }

  if (error && !user) {
    return <div className="error-message">{error}</div>;
  }

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);

  return (
    <div className="profile-container">
      <h1>Kullanıcı Profili</h1>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {isEditing ? (
        <UpdateProfile
          user={user}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={() => setIsEditing(false)}
        />
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

          <div className="profile-detail">
            <span className="label">Kayıt Tarihi:</span>
            <span className="value">
              {new Date(user.created_at).toLocaleDateString('tr-TR')}
            </span>
          </div>

          <div className="profile-detail">
            <span className="label">API Anahtarı:</span>
            <span className="value api-key">
              {user.api_key ? (
                <>
                  <span className="api-key-value">
                    {showApiKey ? user.api_key : '••••••••••••••••••'}
                  </span>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="toggle-api-btn"
                  >
                    {showApiKey ? 'Gizle' : 'Göster'}
                  </button>
                  <button
                    onClick={handleCopyApiKey}
                    className="copy-btn"
                  >
                    Kopyala
                  </button>
                </>
              ) : (
                'Bulunamadı'
              )}
            </span>
          </div>

          {bmi && (
            <div className="profile-bmi">
              <h3>Vücut Kitle İndeksi (BMI)</h3>
              <div className="bmi-value">
                <span className="label">BMI Değeri:</span>
                <span className="value">{bmi}</span>
              </div>
              <div className="bmi-category">
                <span className="label">Durum:</span>
                <span className={`value ${getBMICategoryClass(bmiCategory)}`}>
                  {bmiCategory}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary"
          >
            <FaEdit /> Profili Düzenle
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
