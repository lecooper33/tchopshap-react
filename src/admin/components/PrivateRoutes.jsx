// src/admin/components/AdminPrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole');

  if (!token || role !== 'administrateur') {
    return <Navigate to="/admin/login" />;
  }

  return children;
};

export default PrivateRoute;
