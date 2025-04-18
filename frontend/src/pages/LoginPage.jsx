import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('student');
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  // Animation effect for particles and glow
  useEffect(() => {
    // This empty useEffect will trigger initial animations
  }, []);

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

        // Different payload structure based on user type
        if (activeTab === 'student') {
          payload = {
            username: formData.username, // Student uses email for login
            password: formData.password,
          };
        } else if (activeTab === 'teacher') {
          payload = {
            username: formData.username,
            password: formData.password,
          };
        } else {
          payload = {
            username: formData.username,
            password: formData.password,
          };
        }

        const response = await fetch(loginEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Login failed');
          } else {
            throw new Error('Server error occurred');
          }
        }

        const data = await response.json();

        // Store the tokens in localStorage
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('userType', activeTab);
        
        // Navigate based on user type and status
        if (activeTab === 'teacher') {
          if (!data.profile_status.has_profile) {
            navigate('/teacher/profile');
          } else if (data.profile_status.verification_status === 'pending') {
            navigate('/teacher/pending-verification');
          } else if (data.profile_status.verification_status === 'approved') {
            navigate('/teacher/dashboard');
          } else {
            setError('Your profile has been rejected. Please contact management.');
          }
        } else if (activeTab === 'student') {
          navigate('/student-dashboard');
        } else if (activeTab === 'management') {
          navigate('/management/dashboard');
        }
        return;
      }

      // Registration logic
      switch (activeTab) {
        case 'student':
          endpoint = 'http://127.0.0.1:8000/api/students/register/';
          // Updated payload to match StudentRegistrationSerializer
          if (!formData.email || !formData.username || !formData.password || 
              !formData.password2 || !formData.student_id || 
              !formData.department || !formData.year) {
            throw new Error('All fields are required');
          }
          
          // Validate password match
          if (formData.password !== formData.password2) {
            throw new Error('Passwords do not match');
          }

          payload = {
            user: {
              username: formData.username,
              email: formData.email,
              password: formData.password
            },
            student_id: formData.student_id,
            department: formData.department,
            year: parseInt(formData.year, 10),
            password2: formData.password2
          };
          break;
        case 'teacher':
          endpoint = 'http://127.0.0.1:8000/api/teachers/register/';
          // Updated payload to match TeacherRegistrationSerializer
          if (!formData.username || !formData.password || !formData.password2) {
            throw new Error('All fields are required');
          }
          
          // Validate password match
          if (formData.password !== formData.password2) {
            throw new Error('Passwords do not match');
          }
          
          // The teacher registration only needs username, password, and password2
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

      // Add this before sending the request
      console.log('Sending registration payload:', payload);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Add this after getting the response
      const data = await response.json();
      console.log('Registration response:', data);

      if (!response.ok) {
        // Log the full error response
        console.log('Registration error response:', data);
        
        // Handle different types of error responses
        if (data.user) {
          throw new Error(Object.values(data.user).flat().join(', '));
        }
        if (data.non_field_errors) {
          throw new Error(data.non_field_errors.join(', '));
        }
        if (typeof data === 'object') {
          const errors = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          throw new Error(errors);
        }
        throw new Error(data.detail || 'Registration failed');
      }

      // Registration successful
      setIsLogin(true);
      setFormData({});
      alert('Registration successful! Please login.');

    } catch (err) {
      console.error('Registration Error:', err);
      setError(err.message || 'Registration failed. Please check all fields.');
    }
  };

  const renderForm = () => {
    // Student Login Form
    if (activeTab === 'student' && isLogin) {
      return (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="username"  // Using username for the API but presenting as email
              placeholder="Email"
              value={formData.username || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
        </form>
      );
    }
    
    // Student Registration Form
    if (activeTab === 'student' && !isLogin) {
      return (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="student_id"
              placeholder="Student ID"
              value={formData.student_id || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2 || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
      );
    }
    
    // Teacher Login Form
    if (activeTab === 'teacher' && isLogin) {
      return (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
        </form>
      );
    }
    
    // Teacher Registration Form
    if (activeTab === 'teacher' && !isLogin) {
      return (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2 || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-helper-text">
            <small>
              You will be able to complete your profile with additional details after registration.
            </small>
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
      );
    }
    
    // Management Login Form
    if (activeTab === 'management' && isLogin) {
      return (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username || ''}
              onChange={handleInputChange}
              required
              className="login-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password || ''}
              onChange={handleInputChange}
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
          <div className="forgot-password">
            <a href="#">Forgot password?</a>
          </div>
        </form>
      );
    }
    
    // Management Registration Form
    if (activeTab === 'management' && !isLogin) {
      return (
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={formData.password2 || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="position"
              placeholder="Position"
              value={formData.position || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Register</button>
        </form>
      );
    }
  };

  // Render function with animated background elements
  return (
    <div className="login-container">
      {/* Background Animation Elements */}
      <div className="login-background">
        <div className="login-grid-lines"></div>
        <div className="login-particles">
          <div className="login-particle"></div>
          <div className="login-particle"></div>
          <div className="login-particle"></div>
          <div className="login-particle"></div>
        </div>
        <div className="login-animated-shape login-shape-1"></div>
        <div className="login-animated-shape login-shape-2"></div>
      </div>

      <div className="login-box">
        <div className="login-box-glow"></div>
        
        <h1 className="login-title">
          <span>Intern</span>Hub
        </h1>
        
        {error && <div className="error-message">{error}</div>}
        
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
        
        <div className="or-divider">
          <span>OR</span>
        </div>
        
        <div className="social-login">
          <button className="social-button">G</button>
          <button className="social-button">f</button>
          <button className="social-button">in</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;