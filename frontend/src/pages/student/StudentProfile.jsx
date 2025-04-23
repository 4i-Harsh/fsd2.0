import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
`;

const pulse = keyframes`
  0% { opacity: 0.5; transform: scale(1); }
  100% { opacity: 0.8; transform: scale(1.1); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  background-color: black;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(249, 115, 22, 0.3), transparent 70%);
    z-index: 0;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(249, 115, 22, 0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(249, 115, 22, 0.07) 1px, transparent 1px);
    background-size: 40px 40px;
    z-index: 1;
    pointer-events: none;
  }
`;

const ProfileCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  position: relative;
  border: 1px solid rgba(249, 115, 22, 0.2);
  animation: ${fadeIn} 0.5s ease-in-out;
  backdrop-filter: blur(5px);
  overflow-y: auto;
  max-height: 90vh;
  z-index: 10;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 1.5rem;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 25px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(249, 115, 22, 0.3);
    border-radius: 3px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, 
      transparent 0%,
      #f97316 20%, 
      #f97316 50%,
      #ea580c 80%,
      transparent 100%
    );
    border-radius: 3px;
    animation: ${shimmer} 3s infinite;
    background-size: 200% 100%;
    box-shadow: 0 0 15px rgba(249, 115, 22, 0.5);
  }
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
`;

const FormGroup = styled.div`
  margin-bottom: 1.2rem;
  position: relative;
  width: ${props => props.$fullWidth ? '100%' : 'calc(50% - 0.5rem)'};

  @media (max-width: 768px) {
    width: 100%;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #d1d5db;
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }

  input {
    width: 100%;
    padding: 0.8rem;
    border: 1px solid rgba(249, 115, 22, 0.2);
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    color: white;

    &:focus {
      outline: none;
      border-color: #f97316;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2);
    }
  }

  input[type="file"] {
    padding: 0.7rem;
    border: 1px dashed #f97316;
    background-color: rgba(249, 115, 22, 0.05);
    cursor: pointer;

    &:hover {
      background-color: rgba(249, 115, 22, 0.1);
    }
  }
`;

const AnimatedShape = styled.div`
  position: absolute;
  background: linear-gradient(45deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0));
  border-radius: 50%;
  filter: blur(40px);
  z-index: 1;
`;

const Shape1 = styled(AnimatedShape)`
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  animation: ${pulse} 15s infinite alternate ease-in-out;
`;

const Shape2 = styled(AnimatedShape)`
  width: 250px;
  height: 250px;
  bottom: -80px;
  left: -80px;
  animation: ${pulse} 20s infinite alternate-reverse ease-in-out;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(to right, #f97316, #ea580c);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);
  position: relative;
  overflow: hidden;
  margin-top: 0.5rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: 0.5s;
  }

  &:hover {
    background: linear-gradient(to right, #ea580c, #c2410c);
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(249, 115, 22, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:disabled {
    background: #4b5563;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  border-left: 3px solid #e74c3c;
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: white;
  position: relative;
  z-index: 10;
  background: rgba(0, 0, 0, 0.8);

  &::after {
    content: '';
    width: 30px;
    height: 30px;
    border: 3px solid transparent;
    border-top-color: #f97316;
    border-radius: 50%;
    animation: ${spin} 1s ease infinite;
    margin-left: 10px;
  }
`;

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
      
      const updatableFields = [
        'full_name',
        'roll_no',
        'email',
        'mobile_no',
        'dept_of_study',
        'linkedin_url'
      ];

      updatableFields.forEach(field => {
        if (formData[field] !== undefined) {
          formDataToSend.append(field, formData[field]);
        }
      });

      if (formData.resume instanceof File) {
        formDataToSend.append('resume', formData.resume);
      }

      const response = await fetch('http://127.0.0.1:8000/api/students/profile/', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: formDataToSend
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          const errorMessage = Object.entries(responseData)
            .map(([key, value]) => `${key}: ${value.join(', ')}`)
            .join('\n');
          throw new Error(errorMessage || 'Validation failed');
        }
        throw new Error(responseData.detail || 'Failed to update profile');
      }

      setLoading(false);
      window.location.href = '/student-dashboard';
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  return (
    <Container>
      <Shape1 />
      <Shape2 />
      
      <ProfileCard>
        <Title>Complete Your Profile</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Roll Number *</label>
            <input
              type="text"
              name="roll_no"
              value={formData.roll_no || ''}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Mobile Number *</label>
            <input
              type="tel"
              name="mobile_no"
              value={formData.mobile_no || ''}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Department of Study *</label>
            <input
              type="text"
              name="dept_of_study"
              value={formData.dept_of_study || ''}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>LinkedIn URL</label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url || ''}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/your-profile"
            />
          </FormGroup>

          <FormGroup $fullWidth>
            <label>Resume</label>
            <input
              type="file"
              name="resume"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </SubmitButton>
        </Form>
      </ProfileCard>
    </Container>
  );
};

export default StudentProfile; 