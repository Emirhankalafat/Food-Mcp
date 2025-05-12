import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUtensils, 
  FaChartBar, 
  FaUserCircle, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus, 
  FaBars, 
  FaTimes 
} from 'react-icons/fa';

const Navbar = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Yükleme tamamlandıysa scroll event'ini ekle
    if (!isLoading) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isLoading]);

  // Yükleme sırasında minimal içerik
  if (isLoading) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <div className="logo">
            <FaUtensils className="logo-icon" />
            <span className="logo-text">Diet Tracker</span>
          </div>
        </div>
      </nav>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <Link to="/">
            <FaUtensils className="logo-icon" />
            <span className="logo-text">Diet Tracker</span>
          </Link>
        </div>
        
        <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
        
        <ul className={`nav-links ${isMenuOpen ? 'show' : ''}`}>
          {user ? (
            <>
              <li className={isActive('/dashboard')}>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <FaChartBar className="nav-icon" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className={isActive('/food-journal')}>
                <Link to="/food-journal" onClick={() => setIsMenuOpen(false)}>
                  <FaUtensils className="nav-icon" />
                  <span>Besin Kaydı</span>
                </Link>
              </li>
              <li className={isActive('/profile')}>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <FaUserCircle className="nav-icon" />
                  <span>Profil</span>
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="logout-btn">
                  <FaSignOutAlt className="nav-icon" />
                  <span>Çıkış Yap</span>
                </button>
              </li>
            </>
          ) : (
            <>
              <li className={isActive('/login')}>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <FaSignInAlt className="nav-icon" />
                  <span>Giriş Yap</span>
                </Link>
              </li>
              <li className={isActive('/register')}>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <FaUserPlus className="nav-icon" />
                  <span>Kayıt Ol</span>
                </Link>
              </li>
            </>
          )}
        </ul>
        
        {user && (
          <div className="user-info">
            <FaUserCircle className="user-icon" />
            <span className="user-name">{user.name || 'Kullanıcı'}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;