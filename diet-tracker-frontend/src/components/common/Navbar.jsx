// src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Diet Tracker</Link>
      </div>
      
      <ul className="nav-links">
        {user ? (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/food-journal">Besin Kaydı</Link>
            </li>
            <li>
              <Link to="/profile">Profil</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-btn">
                Çıkış Yap
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Giriş Yap</Link>
            </li>
            <li>
              <Link to="/register">Kayıt Ol</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;