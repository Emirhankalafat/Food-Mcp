// src/pages/ProfilePage.jsx
import React from 'react';
import '../styles/ProfilePage.css';
import { useAuth } from '../context/AuthContext';
import Profile from '../components/profile/Profile';
import { FaUser, FaLock, FaTrashAlt } from 'react-icons/fa';
import { useState } from 'react';
import { changePassword, deleteAccount } from '../api/userService';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deleteForm, setDeleteForm] = useState({
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleDeleteChange = (e) => {
    setDeleteForm({
      ...deleteForm,
      [e.target.name]: e.target.value
    });
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Parola doğrulama
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Yeni parolalar eşleşmiyor');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('Yeni parola en az 6 karakter olmalıdır');
      return;
    }

    try {
      setIsLoading(true);
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setSuccessMessage('Parola başarıyla değiştirildi');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Parola değiştirilirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const submitDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (!window.confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
      return;
    }

    try {
      setIsLoading(true);
      await deleteAccount(deleteForm);
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Hesap silinirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!authUser) {
    return (
      <div className="not-authenticated">
        <h2>Oturum Açılmadı</h2>
        <p>Bu sayfayı görüntülemek için lütfen giriş yapın.</p>
        <button onClick={() => navigate('/login')} className="btn-primary">
          Giriş Yap
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser /> Profil Bilgileri
        </button>
        <button 
          className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <FaLock /> Parola Değiştir
        </button>
        <button 
          className={`tab-button ${activeTab === 'delete' ? 'active' : ''}`}
          onClick={() => setActiveTab('delete')}
        >
          <FaTrashAlt /> Hesabı Sil
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'profile' && (
          <Profile />
        )}

        {activeTab === 'password' && (
          <div className="password-change-container">
            <h2>Parola Değiştir</h2>
            
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <form onSubmit={submitPasswordChange}>
              <div className="form-group">
                <label htmlFor="currentPassword">Mevcut Parola</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">Yeni Parola</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Yeni Parola (Tekrar)</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'İşleniyor...' : 'Parolayı Değiştir'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'delete' && (
          <div className="delete-account-container">
            <h2>Hesabı Sil</h2>
            
            <div className="warning-box">
              <h3>Uyarı!</h3>
              <p>Hesabınızı silmek üzeresiniz. Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={submitDeleteAccount}>
              <div className="form-group">
                <label htmlFor="password">Parolanızı Girin</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={deleteForm.password}
                  onChange={handleDeleteChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="btn-danger"
                disabled={isLoading}
              >
                {isLoading ? 'İşleniyor...' : 'Hesabımı Kalıcı Olarak Sil'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;