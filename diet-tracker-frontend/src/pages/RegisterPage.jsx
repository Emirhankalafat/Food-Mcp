// src/pages/RegisterPage.jsx
import React from 'react';
import Register from '../components/auth/Register';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <h1>Diet Tracker'a Kayıt Ol</h1>
      <p>Hemen yeni bir hesap oluşturun ve yolculuğunuza başlayın!</p>
      <div className="register-container">
        <Register />
      </div>
    </div>
  );
};

export default RegisterPage;
