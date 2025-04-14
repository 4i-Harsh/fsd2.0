import React, { useState } from 'react';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('student');
  const [isLogin, setIsLogin] = useState(true);

  const renderForm = () => {
    const commonFields = (
      <>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
      </>
    );

    const studentFields = (
      <>
        {!isLogin && (
          <>
            <input type="text" placeholder="Student ID" required />
            <input type="text" placeholder="Department" required />
            <input type="number" placeholder="Year" required />
          </>
        )}
        {commonFields}
      </>
    );

    const teacherFields = (
      <>
        {!isLogin && (
          <>
            <input type="email" placeholder="Email" required />
            <input type="text" placeholder="Department" required />
            <input type="text" placeholder="Designation" required />
          </>
        )}
        {commonFields}
      </>
    );

    const managementFields = (
      <>
        {!isLogin && (
          <>
            <input type="email" placeholder="Email" required />
            <input type="text" placeholder="Position" required />
          </>
        )}
        {commonFields}
      </>
    );

    return (
      <form className="auth-form">
        {activeTab === 'student' && studentFields}
        {activeTab === 'teacher' && teacherFields}
        {activeTab === 'management' && managementFields}
        <button type="submit" className="submit-button">
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
    );
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'student' ? 'active' : ''}`}
            onClick={() => setActiveTab('student')}
          >
            Student
          </button>
          <button
            className={`tab ${activeTab === 'teacher' ? 'active' : ''}`}
            onClick={() => setActiveTab('teacher')}
          >
            Teacher
          </button>
          <button
            className={`tab ${activeTab === 'management' ? 'active' : ''}`}
            onClick={() => setActiveTab('management')}
          >
            Management
          </button>
        </div>

        <div className="auth-toggle">
          <button
            className={`toggle-button ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`toggle-button ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {renderForm()}
      </div>
    </div>
  );
};

export default LoginPage; 