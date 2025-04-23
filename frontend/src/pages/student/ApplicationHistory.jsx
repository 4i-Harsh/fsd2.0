import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/ApplicationHistory.css';

const ApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://127.0.0.1:8000/api/students/applications/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch applications');
        }

        const data = await response.json();
        
        // Fetch internship details for each application
        const applicationsWithDetails = await Promise.all(
          data.map(async (application) => {
            try {
              const internshipResponse = await fetch(
                `http://127.0.0.1:8000/api/managements/internships/${application.internship}/`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                  }
                }
              );

              if (!internshipResponse.ok) {
                throw new Error('Failed to fetch internship details');
              }

              const internshipData = await internshipResponse.json();
              return {
                ...application,
                internshipDetails: internshipData
              };
            } catch (error) {
              console.error('Error fetching internship details:', error);
              return {
                ...application,
                internshipDetails: null
              };
            }
          })
        );

        setApplications(applicationsWithDetails);
        setError('');
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token, navigate]);

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'shortlisted':
        return 'status-shortlisted';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="applications-loading">Loading your applications...</div>;
  }

  if (error) {
    return <div className="applications-error">{error}</div>;
  }

  return (
    <div className="applications-container">
      <h2>My Applications</h2>
      
      {applications.length === 0 ? (
        <div className="no-applications">
          <p>You haven't applied to any internships yet.</p>
          <button 
            className="browse-internships-btn"
            onClick={() => navigate('/student-dashboard')}
          >
            Browse Available Internships
          </button>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div key={application.id} className="application-card">
              <div className="application-header">
                <h3>{application.internshipDetails?.title || 'Internship'}</h3>
                <span className={`status-badge ${getStatusBadgeClass(application.status)}`}>
                  {application.status}
                </span>
              </div>
              
              <div className="application-details">
                <div className="detail-group">
                  <span className="detail-label">Company:</span>
                  <span>{application.internshipDetails?.company_name || 'Not specified'}</span>
                </div>
                
                <div className="detail-group">
                  <span className="detail-label">Applied On:</span>
                  <span>{formatDate(application.applied_at)}</span>
                </div>
                
                <div className="detail-group">
                  <span className="detail-label">Location:</span>
                  <span>{application.internshipDetails?.location || 'Not specified'}</span>
                </div>
                
                {application.internshipDetails && (
                  <div className="detail-group">
                    <span className="detail-label">Duration:</span>
                    <span>
                      {formatDate(application.internshipDetails.start_date)} - 
                      {formatDate(application.internshipDetails.end_date)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="application-description">
                <h4>Your Application Note:</h4>
                <p>{application.description}</p>
              </div>
              
              <div className="application-resume">
                <span className="resume-label">Submitted Resume:</span>
                <a 
                  href={application.resume} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="view-resume-btn"
                >
                  View Resume
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationHistory; 