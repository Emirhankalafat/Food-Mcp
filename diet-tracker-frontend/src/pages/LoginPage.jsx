import React from 'react';
import '../styles/AuthPages.css';
import Login from '../components/auth/Login';

const LoginPage = () => {
  return (
    <div className="login-page">
      <h1>Diet Tracker'a Hoş Geldiniz</h1>
      <p>Lütfen giriş yapın veya yeni bir hesap oluşturun.</p>
      <div className="login-container">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;