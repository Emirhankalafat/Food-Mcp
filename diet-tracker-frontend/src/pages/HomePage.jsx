// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Diet Tracker</h1>
        <p className="hero-subtitle">
          Beslenmenizi takip edin, sağlıklı bir yaşam sürün
        </p>
        
        {!user ? (
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">
              Giriş Yap
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Hesap Oluştur
            </Link>
          </div>
        ) : (
          <div className="hero-buttons">
            <Link to="/dashboard" className="btn btn-primary">
              Dashboard'a Git
            </Link>
          </div>
        )}
      </div>
      
      <div className="features-section">
        <h2>Özellikler</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Kalori Takibi</h3>
            <p>Tükettiğiniz besinlerin kalori değerlerini takip edin</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📆</div>
            <h3>Günlük Beslenme</h3>
            <p>Günlük beslenmenizi planlayın ve kaydedin</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>İstatistikler</h3>
            <p>Beslenme alışkanlıklarınızı analiz edin</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💪</div>
            <h3>Sağlıklı Yaşam</h3>
            <p>Sağlıklı beslenme hedeflerinize ulaşın</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>Nasıl Çalışır?</h2>
        
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Hesap Oluşturun</h3>
            <p>Hızlıca kayıt olun ve profil bilgilerinizi güncelleyin</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Yemeklerinizi Kaydedin</h3>
            <p>Tükettiğiniz besinleri ve miktarlarını kaydedin</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Takip Edin</h3>
            <p>Günlük ve haftalık beslenme istatistiklerinizi görüntüleyin</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Hedeflerinize Ulaşın</h3>
            <p>Beslenme alışkanlıklarınızı geliştirerek hedeflerinize ulaşın</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;