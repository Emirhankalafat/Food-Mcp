import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user, isLoading } = useAuth();

  // Yükleme sırasında null döndür
  if (isLoading) {
    return null;
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;