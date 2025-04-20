import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InternshipListing from '../components/InternshipListing';
import ApplicationHistory from '../components/ApplicationHistory';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://127.0.0.1:8000/api/students/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            // Token might be expired, redirect to login
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch student data');
        }

        const data = await response.json();
        setStudentData(data);
        setError('');
      } catch (error) {
        console.error('Error fetching student data:', error);
        setError('Failed to load student data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [token, navigate]);

  const handleEditProfile = () => {
    navigate('/student-profile');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-error">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {studentData?.full_name || 'Student'}</h1>
        
        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabChange('profile')}
          >
            My Profile
          </button>
          <button 
            className={`tab-button ${activeTab === 'internships' ? 'active' : ''}`}
            onClick={() => handleTabChange('internships')}
          >
            Internships
          </button>
          <button 
            className={`tab-button ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => handleTabChange('applications')}
          >
            My Applications
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Your Profile</h2>
            <div className="profile-info">
              <div className="info-group">
                <label>Full Name:</label>
                <span>{studentData?.full_name}</span>
              </div>
              <div className="info-group">
                <label>Roll Number:</label>
                <span>{studentData?.roll_no}</span>
              </div>
              <div className="info-group">
                <label>Email:</label>
                <span>{studentData?.email}</span>
              </div>
              <div className="info-group">
                <label>Mobile Number:</label>
                <span>{studentData?.mobile_no}</span>
              </div>
              <div className="info-group">
                <label>Department:</label>
                <span>{studentData?.dept_of_study}</span>
              </div>
              {studentData?.linkedin_url && (
                <div className="info-group">
                  <label>LinkedIn:</label>
                  <a href={studentData.linkedin_url} target="_blank" rel="noopener noreferrer">
                    View Profile
                  </a>
                </div>
              )}
            </div>
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              Edit Profile
            </button>
          </div>
        )}
        
        {activeTab === 'internships' && (
          <InternshipListing />
        )}
        
        {activeTab === 'applications' && (
          <ApplicationHistory />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;