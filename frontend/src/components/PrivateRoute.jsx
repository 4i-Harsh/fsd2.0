import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(null);
  const location = useLocation();
  const token = localStorage.getItem('access');

  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/students/profile/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        
        // Check if all required fields are filled
        const requiredFields = ['full_name', 'roll_no', 'email', 'mobile_no', 'dept_of_study'];
        const isComplete = requiredFields.every(field => data[field]);
        setIsProfileComplete(isComplete);
      } catch (error) {
        console.error('Error checking profile:', error);
        setIsProfileComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      checkProfileCompletion();
    } else {
      setIsLoading(false);
    }
  }, [token, location.pathname]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If we're already on the profile page, render it regardless of completion status
  if (location.pathname === '/student-profile') {
    return children;
  }

  // Only redirect to profile page if profile is incomplete and we're not already there
  if (!isProfileComplete) {
    return <Navigate to="/student-profile" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute; 