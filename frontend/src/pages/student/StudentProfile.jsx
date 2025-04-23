import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiBook, FiLinkedin, FiFileText, FiSave, FiArrowLeft } from 'react-icons/fi';

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

const Container = styled(motion.div)`
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

const ProfileCard = styled(motion.div)`
  background: rgba(20, 20, 20, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  padding: 2.5rem;
  width: 100%;
  max-width: 800px;
  position: relative;
  border: 1px solid rgba(255, 107, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  max-height: 90vh;
  z-index: 10;

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

const Title = styled(motion.h1)`
  color: white;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 1rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
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

const Form = styled(motion.form)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled(motion.div)`
  position: relative;
  grid-column: ${props => props.$fullWidth ? '1 / -1' : 'span 1'};

  label {
    display: block;
    margin-bottom: 0.75rem;
    color: #d1d5db;
    font-weight: 500;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    svg {
      color: #ff6b00;
    }
  }

  input {
    width: 100%;
    padding: 1rem;
    background: rgba(30, 30, 30, 0.6);
    border: 1px solid rgba(255, 107, 0, 0.2);
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(5px);

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

  input[type="file"] {
    padding: 0.8rem;
    border: 2px dashed rgba(255, 107, 0, 0.3);
    background: rgba(255, 107, 0, 0.05);
    cursor: pointer;
    font-size: 0.9rem;

    &:hover {
      background: rgba(255, 107, 0, 0.1);
      border-color: rgba(255, 107, 0, 0.4);
    }

    &::file-selector-button {
      background: #ff6b00;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      color: white;
      margin-right: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #ea580c;
      }
    }
  }
`;

const ButtonGroup = styled(motion.div)`
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

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

const ErrorMessage = styled(motion.div)`
  background: rgba(231, 76, 60, 0.1);
  border-left: 4px solid #e74c3c;
  color: #e74c3c;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: black;
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

const AnimatedShape = styled(motion.div)`
  position: absolute;
  background: linear-gradient(45deg, rgba(255, 107, 0, 0.15), rgba(255, 107, 0, 0));
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
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

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
        throw new Error(responseData.detail || 'Failed to update profile');
      }

      navigate('/student-dashboard');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LoadingContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <FiUser />
        Loading profile...
      </LoadingContainer>
    );
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Shape1 />
      <Shape2 />
      
      <ProfileCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Complete Your Profile
        </Title>

        {error && (
          <ErrorMessage
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label>
              <FiUser />
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </FormGroup>

          <FormGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label>
              <FiFileText />
              Roll Number
            </label>
            <input
              type="text"
              name="roll_no"
              value={formData.roll_no || ''}
              onChange={handleChange}
              required
              placeholder="Enter your roll number"
            />
          </FormGroup>

          <FormGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label>
              <FiMail />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </FormGroup>

          <FormGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <label>
              <FiPhone />
              Mobile Number
            </label>
            <input
              type="tel"
              name="mobile_no"
              value={formData.mobile_no || ''}
              onChange={handleChange}
              required
              placeholder="Enter your mobile number"
            />
          </FormGroup>

          <FormGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <label>
              <FiBook />
              Department of Study
            </label>
            <input
              type="text"
              name="dept_of_study"
              value={formData.dept_of_study || ''}
              onChange={handleChange}
              required
              placeholder="Enter your department"
            />
          </FormGroup>

          <FormGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <label>
              <FiLinkedin />
              LinkedIn URL
            </label>
            <input
              type="url"
              name="linkedin_url"
              value={formData.linkedin_url || ''}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/your-profile"
            />
          </FormGroup>

          <FormGroup
            $fullWidth
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <label>
              <FiFileText />
              Resume
            </label>
            <input
              type="file"
              name="resume"
              onChange={handleChange}
              accept=".pdf,.doc,.docx"
            />
          </FormGroup>

          <ButtonGroup
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <Button
              type="button"
              onClick={() => navigate('/student-dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiArrowLeft />
              Back to Dashboard
            </Button>
            <Button
              type="submit"
              $primary
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiSave />
              Save Profile
            </Button>
          </ButtonGroup>
        </Form>
      </ProfileCard>
    </Container>
  );
};

export default StudentProfile; 