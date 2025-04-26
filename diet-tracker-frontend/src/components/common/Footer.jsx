// src/components/common/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {currentYear} Diet Tracker - Tüm Hakları Saklıdır</p>
      </div>
    </footer>
  );
};

export default Footer;