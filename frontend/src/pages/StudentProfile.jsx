import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StudentProfile.css';

const StudentProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    roll_no: '',
    email: '',
    mobile_no: '',
    dept_of_study: '',
    resume: null,
    linkedin_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Flag to prevent state updates if component unmounts
    let isMounted = true;
    
    const fetchProfile = async () => {
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
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch profile');
        }

        const data = await response.json();
        if (isMounted) {
          setFormData(prevData => ({
            ...prevData,
            ...data
          }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (isMounted) {
          setError('Failed to load profile data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
      setError('You are not logged in. Please log in first.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Only send fields that are allowed to be updated
      const updatableFields = [
        'full_name',
        'roll_no',
        'email',
        'mobile_no',
        'dept_of_study',
        'linkedin_url'
      ];

      // Debug: Log all form data values before sending
      console.log("Form data before sending:", formData);

      updatableFields.forEach(field => {
        if (formData[field] !== undefined) {
          formDataToSend.append(field, formData[field]);
          // Debug: Log each field as it's added
          console.log(`Adding field ${field}:`, formData[field]);
        }
      });

      // Handle resume file separately
      if (formData.resume instanceof File) {
        formDataToSend.append('resume', formData.resume);
        console.log("Adding resume file:", formData.resume.name);
      }

      // Debug: Log final FormData entries (not directly visible but useful for debugging)
      console.log("FormData entries:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await fetch('http://127.0.0.1:8000/api/students/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type when sending FormData
          'Accept': 'application/json'
        },
        body: formDataToSend
      });

      // Debug: Log the raw response
      console.log("Response status:", response.status);
      const responseData = await response.json();
      console.log("Response data:", responseData);

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 400) {
          const errorMessage = Object.entries(responseData)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('\n');
          throw new Error(errorMessage || 'Validation failed');
        }
        throw new Error(responseData.detail || 'Failed to update profile');
      }

      console.log('Profile updated successfully:', responseData);
      
      // Set loading to false 
      setLoading(false);
      
      // Direct navigation without alert
      window.location.href = '/student-dashboard';
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      {/* Animated background elements */}
      <div className="animated-shape shape-1"></div>
      <div className="animated-shape shape-2"></div>
      
      <div className="profile-card">
        <h1>Complete Your Profile</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Roll Number *</label>
            <input
              type="text"
              name="roll_no"
              value={formData.roll_no || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              type="tel"
              name="mobile_no"
              value={formData.mobile_no || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Department of Study *</label>
            <input
              type="text"
              name="dept_of_study"
              value={formData.dept_of_study || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>LinkedIn URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url || ''}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/your-profile"
            />
          </div>

          <div className="form-group full-width">
            <label>Resume</label>
            <input
              type="file"
              name="resume"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile; 