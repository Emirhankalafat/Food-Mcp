// src/pages/HomePage.jsx
import React from 'react';
import '../styles/HomePage.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUtensils, FaChartPie, FaCalendarAlt, FaLightbulb, FaUserPlus, FaClipboardList, FaChartLine, FaCheck } from 'react-icons/fa';

const HomePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Diet Tracker</h1>
          <p className="hero-subtitle">
            Beslenmenizi akıllıca takip edin, sağlıklı bir yaşama adım atın
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
              <Link to="/food-journal" className="btn btn-secondary">
                Besin Günlüğü
              </Link>
            </div>
          )}
        </div>
        <div className="hero-image">
          <img src="/healthy-food.svg" alt="Sağlıklı Beslenme" />
        </div>
      </div>
      
      <div className="features-section">
        <h2><FaLightbulb /> Özellikler</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaUtensils />
            </div>
            <h3>Detaylı Kalori Takibi</h3>
            <p>Tükettiğiniz her besinin kalori değerini kolayca kaydedin ve takip edin</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaCalendarAlt />
            </div>
            <h3>Günlük Beslenme Planı</h3>
            <p>Günlük öğünlerinizi planlayın ve beslenme dengenizi koruyun</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartPie />
            </div>
            <h3>Görsel İstatistikler</h3>
            <p>Beslenme alışkanlıklarınızı anlaşılır grafikler ile analiz edin</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <h3>İlerleme Takibi</h3>
            <p>Zaman içindeki beslenme değişimlerinizi görün ve hedeflerinize ulaşın</p>
          </div>
        </div>
      </div>
      
      <div className="benefits-section">
        <h2>Neden Diet Tracker?</h2>
        <div className="benefits-container">
          <div className="benefit">
            <div className="benefit-check"><FaCheck /></div>
            <p>Kullanımı kolay, modern arayüz</p>
          </div>
          <div className="benefit">
            <div className="benefit-check"><FaCheck /></div>
            <p>Türkçe dil desteği</p>
          </div>
          <div className="benefit">
            <div className="benefit-check"><FaCheck /></div>
            <p>Detaylı besin analizi</p>
          </div>
          <div className="benefit">
            <div className="benefit-check"><FaCheck /></div>
            <p>Ücretsiz kullanım</p>
          </div>
          <div className="benefit">
            <div className="benefit-check"><FaCheck /></div>
            <p>Vücut kitle indeksi hesaplama</p>
          </div>
          <div className="benefit">
            <div className="benefit-check"><FaCheck /></div>
            <p>Önceki beslenme kayıtlarınıza kolay erişim</p>
          </div>
        </div>
      </div>
      
      <div className="how-it-works">
        <h2>Nasıl Çalışır?</h2>
        
        <div className="steps">
          <div className="step">
            <div className="step-icon">
              <FaUserPlus />
            </div>
            <div className="step-number">1</div>
            <h3>Hesap Oluşturun</h3>
            <p>Hızlıca kayıt olun ve kişisel bilgilerinizi girin</p>
          </div>
          
          <div className="step">
            <div className="step-icon">
              <FaClipboardList />
            </div>
            <div className="step-number">2</div>
            <h3>Günlük Beslenmenizi Kaydedin</h3>
            <p>Tükettiğiniz besinleri, miktarlarını ve kalori değerlerini ekleyin</p>
          </div>
          
          <div className="step">
            <div className="step-icon">
              <FaChartPie />
            </div>
            <div className="step-number">3</div>
            <h3>Verilerinizi Analiz Edin</h3>
            <p>Günlük, haftalık ve aylık beslenme istatistiklerinizi görüntüleyin</p>
          </div>
          
          <div className="step">
            <div className="step-icon">
              <FaCheck />
            </div>
            <div className="step-number">4</div>
            <h3>Hedeflerinize Ulaşın</h3>
            <p>Beslenme alışkanlıklarınızı geliştirerek daha sağlıklı bir yaşam sürün</p>
          </div>
        </div>
      </div>
      
      <div className="testimonials-section">
        <h2>Kullanıcı Yorumları</h2>
        <div className="testimonials">
          <div className="testimonial">
            <div className="quote">"Diet Tracker ile beslenme düzenimi tamamen değiştirdim. Artık daha sağlıklı besleniyorum ve 6 ayda 10 kilo verdim!"</div>
            <div className="author">Ahmet K.</div>
          </div>
          <div className="testimonial">
            <div className="quote">"Kullanımı çok kolay ve pratik. Her gün ne yediğimi takip etmek bu kadar kolay olabilirmiş."</div>
            <div className="author">Ayşe M.</div>
          </div>
          <div className="testimonial">
            <div className="quote">"Bu uygulama sayesinde kalori alımımı dengeli tutabiliyorum. Grafikler ve analizler çok faydalı."</div>
            <div className="author">Mehmet Y.</div>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Sağlıklı Yaşama Bugün Başlayın!</h2>
        <p>Diet Tracker ile beslenmenizi takip edin ve sağlıklı bir yaşam için ilk adımı atın.</p>
        {!user ? (
          <Link to="/register" className="btn btn-large">
            Hemen Ücretsiz Üye Olun
          </Link>
        ) : (
          <Link to="/dashboard" className="btn btn-large">
            Dashboard'a Git
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;