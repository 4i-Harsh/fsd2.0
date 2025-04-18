import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  // Simplified approach - only check if token exists
  if (!token) {
    // Redirect to appropriate login page based on user type
    const loginPath = userType === 'teacher' ? '/teacher/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // For all authenticated users, just render the children
  return children;
};

export default PrivateRoute; 