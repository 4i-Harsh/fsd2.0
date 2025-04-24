import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import PrivateRoute from './components/PrivateRoute';
import TeacherLogin from './pages/teacher/TeacherLogin';
import TeacherProfile from './pages/teacher/TeacherProfile';
import PendingVerification from './pages/teacher/PendingVerification';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherApplications from './pages/teacher/TeacherApplications';
import TeacherStudents from './pages/teacher/TeacherStudents';
import ManagementLogin from './pages/manager/ManagementLogin';
import ManagementDashboard from './pages/manager/ManagementDashboard';
import ApplyInternshipForm from './pages/student/ApplyInternshipForm';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/management/login" element={<ManagementLogin />} />

        {/* Student Routes */}
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
        <Route 
          path="/apply-internship/:internshipId" 
          element={
            <PrivateRoute>
              <ApplyInternshipForm />
            </PrivateRoute>
          } 
        />

        {/* Teacher Routes */}
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
        <Route 
          path="/teacher/applications" 
          element={
            <PrivateRoute>
              <TeacherApplications />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/teacher/students" 
          element={
            <PrivateRoute>
              <TeacherStudents />
            </PrivateRoute>
          } 
        />

        {/* Management Routes */}
        <Route 
          path="/management/dashboard/*" 
          element={
            <PrivateRoute>
              <ManagementDashboard />
            </PrivateRoute>
          } 
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
