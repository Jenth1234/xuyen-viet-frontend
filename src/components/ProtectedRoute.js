import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = () => {
    return localStorage.getItem('accessToken') !== null;
  };

  return isLoggedIn() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
