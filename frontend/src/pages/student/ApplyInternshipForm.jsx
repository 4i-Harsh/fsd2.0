import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/ApplyInternshipForm.css';

const ApplyInternshipForm = () => {
  const { internshipId } = useParams();
  const [internship, setInternship] = useState(null);
  const [description, setDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`http://127.0.0.1:8000/api/managements/internships/${internshipId}/`, {
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
          throw new Error('Failed to fetch internship details');
        }

        const data = await response.json();
        setInternship(data);
        setError('');
      } catch (error) {
        console.error('Error fetching internship details:', error);
        setError('Failed to load internship details: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    if (internshipId) {
      fetchInternshipDetails();
    }
  }, [internshipId, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!resume) {
      setError('Please upload your resume');
      setSubmitting(false);
      return;
    }

    if (!description.trim()) {
      setError('Please provide a description for your application');
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('internship', internshipId);
      formData.append('description', description);
      formData.append('resume', resume);

      const response = await fetch('http://127.0.0.1:8000/api/students/internships/apply/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to submit application');
      }

      setSuccess('Application submitted successfully!');
      setTimeout(() => {
        navigate('/student-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Failed to submit application: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleCancel = () => {
    navigate('/student-dashboard');
  };

  if (loading) {
    return <div className="application-loading">Loading internship details...</div>;
  }

  if (error && !internship) {
    return <div className="application-error">{error}</div>;
  }

  return (
    <div className="application-container">
      <h2>Apply for Internship</h2>
      
      {internship && (
        <div className="internship-summary">
          <h3>{internship.title}</h3>
          <p><strong>Company:</strong> {internship.company_name}</p>
          <p><strong>Location:</strong> {internship.location || 'Not specified'}</p>
          <p><strong>Application Deadline:</strong> {new Date(internship.application_deadline).toLocaleDateString()}</p>
        </div>
      )}
      
      <form className="application-form" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
        
        <div className="form-group">
          <label htmlFor="description">Why are you interested in this internship?</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe why you're a good fit for this position, your relevant skills, and what you hope to learn..."
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="resume">Upload your Resume (PDF)</label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
          <small>Supported formats: PDF, DOC, DOCX</small>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApplyInternshipForm; 