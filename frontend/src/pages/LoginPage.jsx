import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let endpoint = '';
      let payload = {};

      if (isLogin) {
        let loginEndpoint = '';
        switch (activeTab) {
          case 'student':
            loginEndpoint = 'http://127.0.0.1:8000/api/students/login/';
            break;
          case 'teacher':
            loginEndpoint = 'http://127.0.0.1:8000/api/teachers/login/';
            break;
          case 'management':
            loginEndpoint = 'http://127.0.0.1:8000/api/managements/login/';
            break;
        }

        const response = await fetch(loginEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }

        // Store the token in localStorage
        localStorage.setItem('token', data.token);
        
        // Navigate based on user type
        if (activeTab === 'student') {
          navigate('/student-dashboard');
        }
        return;
      }

      // Registration logic
      switch (activeTab) {
        case 'student':
          endpoint = 'http://127.0.0.1:8000/api/students/register/';
          payload = {
            user: {
              username: formData.username,
              email: formData.email,
              password: formData.password
            },
            student_id: formData.student_id,
            department: formData.department,
            year: parseInt(formData.year),
            password2: formData.password2
          };
          break;
        case 'teacher':
          endpoint = 'http://127.0.0.1:8000/api/teachers/register/';
          payload = {
            username: formData.username,
            password: formData.password,
            password2: formData.password2
          };
          break;
        case 'management':
          endpoint = 'http://127.0.0.1:8000/api/managements/register/';
          payload = {
            username: formData.username,
            password: formData.password,
            password2: formData.password2,
            position: formData.position
          };
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          throw new Error(errorMessages.join(', '));
        }
        throw new Error(data.detail || 'Registration failed');
      }

      // Registration successful
      setIsLogin(true);
      setFormData({});
      alert('Registration successful! Please login.');

    } catch (err) {
      setError(err.message);
    }
  };

  const renderForm = () => {
    const commonFields = (
      <>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username || ''}
          onChange={handleInputChange}
          required
        />
        {!isLogin && activeTab === 'student' && (
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email || ''}
            onChange={handleInputChange}
            required
          />
        )}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password || ''}
          onChange={handleInputChange}
          required
        />
        {!isLogin && (
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2 || ''}
            onChange={handleInputChange}
            required
          />
        )}
      </>
    );

    const studentFields = (
      <>
        {!isLogin && (
          <>
            <input
              type="text"
              name="student_id"
              placeholder="Student ID"
              value={formData.student_id || ''}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department || ''}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year || ''}
              onChange={handleInputChange}
              required
            />
          </>
        )}
        {commonFields}
      </>
    );

    const teacherFields = (
      <>
        {!isLogin && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department || ''}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="designation"
              placeholder="Designation"
              value={formData.designation || ''}
              onChange={handleInputChange}
              required
            />
          </>
        )}
        {commonFields}
      </>
    );

    const managementFields = (
      <>
        {!isLogin && (
          <>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position || ''}
              onChange={handleInputChange}
              required
            />
          </>
        )}
        {commonFields}
      </>
    );

    return (
      <form className="auth-form" onSubmit={handleSubmit}>
        {activeTab === 'student' && studentFields}
        {activeTab === 'teacher' && teacherFields}
        {activeTab === 'management' && managementFields}
        {error && <div className="error-message">{error}</div>}
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