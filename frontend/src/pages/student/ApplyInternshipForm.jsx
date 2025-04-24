import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiCalendar, FiFileText, FiSend, FiX, FiUpload, FiArrowLeft } from 'react-icons/fi';

const Container = styled(motion.div)`
  min-height: 100vh;
  padding: 2rem;
  background: #000;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: 
      linear-gradient(45deg, rgba(255, 107, 0, 0.05) 1px, transparent 1px),
      linear-gradient(-45deg, rgba(255, 107, 0, 0.05) 1px, transparent 1px);
    background-size: 30px 30px;
    z-index: 0;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, 
      rgba(255, 107, 0, 0.1) 0%,
      rgba(0, 0, 0, 0) 70%);
    pointer-events: none;
    z-index: 1;
  }
`;

const FormCard = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(20, 20, 20, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 107, 0, 0.1);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 2;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.3), transparent);
  }
`;

const Title = styled(motion.h2)`
  color: white;
  font-size: 2rem;
  text-align: center;
  margin: 0;
  padding: 2rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, 
      transparent,
      #ff6b00 20%, 
      #ff6b00 80%,
      transparent
    );
    border-radius: 2px;
  }
`;

const LoadingDiv = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #ff6b00;
  font-size: 1.2rem;
  gap: 1rem;

  svg {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorDiv = styled(motion.div)`
  background: rgba(231, 76, 60, 0.1);
  border-left: 4px solid #e74c3c;
  color: #e74c3c;
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem;
  font-weight: 500;
`;

const InternshipSummary = styled(motion.div)`
  background: rgba(30, 30, 30, 0.6);
  margin: 0 2rem 2rem;
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 107, 0, 0.1);

  h3 {
    color: white;
    font-size: 1.4rem;
    margin: 0 0 1rem;
  }

  .details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .detail-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #999;

    svg {
      color: #ff6b00;
    }
  }
`;

const Form = styled(motion.form)`
  padding: 2rem;
`;

const FormError = styled(motion.div)`
  background: rgba(231, 76, 60, 0.1);
  border-left: 4px solid #e74c3c;
  color: #e74c3c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const FormSuccess = styled(motion.div)`
  background: rgba(46, 204, 113, 0.1);
  border-left: 4px solid #2ecc71;
  color: #2ecc71;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  font-weight: 500;
`;

const FormGroup = styled(motion.div)`
  margin-bottom: 2rem;

  label {
    display: block;
    margin-bottom: 1rem;
    color: #d1d5db;
    font-weight: 500;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: #ff6b00;
    }
  }

  textarea {
    width: 100%;
    min-height: 200px;
    padding: 1rem;
    background: rgba(30, 30, 30, 0.6);
    border: 1px solid rgba(255, 107, 0, 0.2);
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    resize: vertical;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #ff6b00;
      box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.2);
      background: rgba(30, 30, 30, 0.8);
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
  }

  .file-input-wrapper {
    position: relative;
    width: 100%;
    height: 120px;
    border: 2px dashed rgba(255, 107, 0, 0.3);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: rgba(255, 107, 0, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: rgba(255, 107, 0, 0.1);
      border-color: rgba(255, 107, 0, 0.4);
    }

    input[type="file"] {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    .upload-icon {
      color: #ff6b00;
      font-size: 2rem;
    }

    .upload-text {
      color: #999;
      font-size: 0.9rem;
      text-align: center;
    }

    .file-name {
      color: #ff6b00;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled(motion.button)`
  flex: 1;
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  ${props => props.$primary ? `
    background: linear-gradient(45deg, #ff6b00, #ff8533);
    color: white;
    border: none;
    box-shadow: 0 4px 15px rgba(255, 107, 0, 0.2);

    &:hover {
      box-shadow: 0 6px 20px rgba(255, 107, 0, 0.3);
      transform: translateY(-2px);
    }

    &:disabled {
      background: #4b5563;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    }
  ` : `
    background: rgba(255, 255, 255, 0.05);
    color: white;
    border: 1px solid rgba(255, 107, 0, 0.3);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
  `}
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

  if (loading) {
    return (
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <LoadingDiv>
          <FiBriefcase />
          Loading internship details...
        </LoadingDiv>
      </Container>
    );
  }

  if (error && !internship) {
    return (
      <Container>
        <ErrorDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </ErrorDiv>
      </Container>
    );
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FormCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Apply for Internship
        </Title>
        
        {internship && (
          <InternshipSummary
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3>{internship.title}</h3>
            <div className="details">
              <div className="detail-item">
                <FiBriefcase />
                <span>{internship.company_name}</span>
              </div>
              <div className="detail-item">
                <FiMapPin />
                <span>{internship.location || 'Remote'}</span>
              </div>
              <div className="detail-item">
                <FiCalendar />
                <span>Apply by: {new Date(internship.application_deadline).toLocaleDateString()}</span>
              </div>
            </div>
          </InternshipSummary>
        )}
        
        <Form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {error && (
            <FormError
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {error}
            </FormError>
          )}
          
          {success && (
            <FormSuccess
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {success}
            </FormSuccess>
          )}
          
          <FormGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label>
              <FiFileText />
              Why are you interested in this internship?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe why you're a good fit for this position, your relevant skills, and what you hope to learn..."
              required
            />
          </FormGroup>
          
          <FormGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label>
              <FiUpload />
              Upload your Resume
            </label>
            <div className="file-input-wrapper">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
              />
              <FiUpload className="upload-icon" />
              <div className="upload-text">
                {resume ? (
                  <span className="file-name">{resume.name}</span>
                ) : (
                  'Click or drag to upload your resume (PDF, DOC, DOCX)'
                )}
              </div>
            </div>
          </FormGroup>
          
          <ButtonGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Button
              type="button"
              onClick={() => navigate('/student-dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiArrowLeft />
              Cancel
            </Button>
            <Button
              type="submit"
              $primary
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiSend />
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </ButtonGroup>
        </Form>
      </FormCard>
    </Container>
  );
};

export default ApplyInternshipForm; 