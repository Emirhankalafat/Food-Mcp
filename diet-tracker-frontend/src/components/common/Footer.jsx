// src/components/common/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaHeart, FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Diet Tracker</h3>
            <div className="footer-logo">
              <FaUtensils className="footer-logo-icon" />
            </div>
            <p className="footer-description">
              Beslenme alışkanlıklarınızı takip etmek ve sağlıklı bir yaşam sürmek için modern beslenme takip uygulaması.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Hızlı Bağlantılar</h3>
            <ul className="footer-links">
              <li><Link to="/">Ana Sayfa</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/food-journal">Besin Kaydı</Link></li>
              <li><Link to="/profile">Profil</Link></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">İletişim</h3>
            <p className="contact-item">
              <FaEnvelope /> info@diettracker.com
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <FaFacebook />
              </a>
              <a href="#" className="social-icon">
                <FaTwitter />
              </a>
              <a href="#" className="social-icon">
                <FaInstagram />
              </a>
              <a href="#" className="social-icon">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Diet Tracker - Tüm Hakları Saklıdır
          </p>
          <p className="made-with">
            <span>Sevgiyle yapıldı</span> <FaHeart className="heart-icon" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;