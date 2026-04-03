import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    // If the user is already logged in, redirect them to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
