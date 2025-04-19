import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InternshipListing.css';

const InternshipListing = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://127.0.0.1:8000/api/students/internships/', {
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
          throw new Error('Failed to fetch internships');
        }

        const data = await response.json();
        setInternships(data);
        setError('');
      } catch (error) {
        console.error('Error fetching internships:', error);
        setError('Failed to load internships: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, [token, navigate]);

  const handleApply = (internshipId) => {
    navigate(`/apply-internship/${internshipId}`);
  };

  if (loading) {
    return <div className="internships-loading">Loading internships...</div>;
  }

  if (error) {
    return <div className="internships-error">{error}</div>;
  }

  return (
    <div className="internships-container">
      <h2>Available Internships</h2>
      
      {internships.length === 0 ? (
        <div className="no-internships">
          <p>No internships available at the moment.</p>
        </div>
      ) : (
        <div className="internships-list">
          {internships.map((internship) => (
            <div key={internship.id} className="internship-card">
              <div className="internship-header">
                <h3>{internship.title}</h3>
                <span className="company-name">{internship.company_name}</span>
              </div>
              
              <div className="internship-details">
                <div className="detail-group">
                  <span className="detail-label">Location:</span>
                  <span>{internship.location || 'Not specified'}</span>
                </div>
                
                <div className="detail-group">
                  <span className="detail-label">Duration:</span>
                  <span>
                    {new Date(internship.start_date).toLocaleDateString()} - 
                    {new Date(internship.end_date).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="detail-group">
                  <span className="detail-label">Apply by:</span>
                  <span>{new Date(internship.application_deadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="internship-description">
                <p>{internship.description}</p>
              </div>
              
              {internship.details && (
                <div className="internship-additional-details">
                  {internship.details.requirements && (
                    <div className="detail-section">
                      <h4>Requirements</h4>
                      <p>{internship.details.requirements}</p>
                    </div>
                  )}
                  
                  {internship.details.skills_required && (
                    <div className="detail-section">
                      <h4>Skills Required</h4>
                      <p>{internship.details.skills_required}</p>
                    </div>
                  )}
                  
                  {internship.details.stipend && (
                    <div className="detail-section">
                      <h4>Stipend</h4>
                      <p>{internship.details.stipend}</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="internship-actions">
                <button 
                  className="apply-button"
                  onClick={() => handleApply(internship.id)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InternshipListing; 