import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 1.8rem;
  color: #2c3e50;
  text-align: center;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
`;

const LoadingDiv = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
`;

const ErrorDiv = styled.div`
  color: #e74c3c;
  background-color: #fadbd8;
  border-radius: 5px;
  padding: 15px;
  text-align: center;
`;

const InternshipSummary = styled.div`
  background-color: #f8f9fa;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
  border-left: 4px solid #3498db;

  h3 {
    margin-top: 0;
    margin-bottom: 10px;
    color: #2c3e50;
  }

  p {
    margin: 5px 0;
    color: #34495e;
  }
`;

const Form = styled.form`
  margin-top: 20px;
`;

const FormError = styled.div`
  background-color: #fadbd8;
  color: #c0392b;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
`;

const FormSuccess = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #2c3e50;
  }

  textarea {
    width: 100%;
    min-height: 150px;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
    }
  }

  input[type="file"] {
    display: block;
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f8f9fa;
  }

  small {
    display: block;
    margin-top: 5px;
    color: #7f8c8d;
    font-size: 0.8rem;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;

    button {
      width: 100%;
    }
  }
`;

const CancelButton = styled.button`
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c0392b;
  }
`;

const SubmitButton = styled.button`
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #27ae60;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

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
    return <LoadingDiv>Loading internship details...</LoadingDiv>;
  }

  if (error && !internship) {
    return <ErrorDiv>{error}</ErrorDiv>;
  }

  return (
    <Container>
      <Title>Apply for Internship</Title>
      
      {internship && (
        <InternshipSummary>
          <h3>{internship.title}</h3>
          <p><strong>Company:</strong> {internship.company_name}</p>
          <p><strong>Location:</strong> {internship.location || 'Not specified'}</p>
          <p><strong>Application Deadline:</strong> {new Date(internship.application_deadline).toLocaleDateString()}</p>
        </InternshipSummary>
      )}
      
      <Form onSubmit={handleSubmit}>
        {error && <FormError>{error}</FormError>}
        {success && <FormSuccess>{success}</FormSuccess>}
        
        <FormGroup>
          <label htmlFor="description">Why are you interested in this internship?</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe why you're a good fit for this position, your relevant skills, and what you hope to learn..."
            required
          />
        </FormGroup>
        
        <FormGroup>
          <label htmlFor="resume">Upload your Resume (PDF)</label>
          <input
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            required
          />
          <small>Supported formats: PDF, DOC, DOCX</small>
        </FormGroup>
        
        <FormActions>
          <CancelButton type="button" onClick={handleCancel}>
            Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </SubmitButton>
        </FormActions>
      </Form>
    </Container>
  );
};

export default ApplyInternshipForm; 