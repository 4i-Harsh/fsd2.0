import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import PrivateRoute from './components/PrivateRoute';
import TeacherLogin from './components/TeacherLogin';
import TeacherProfile from './components/TeacherProfile';
import PendingVerification from './components/PendingVerification';
import TeacherDashboard from './components/TeacherDashboard';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/student-profile" 
          element={
            <PrivateRoute>
              <StudentProfile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/student-dashboard" 
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          } 
        />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route 
          path="/teacher/profile" 
          element={
            <PrivateRoute>
              <TeacherProfile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/teacher/pending-verification" 
          element={
            <PrivateRoute>
              <PendingVerification />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/teacher/dashboard" 
          element={
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
