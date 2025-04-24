import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FiUser, FiMail, FiBriefcase, FiAward, FiLinkedin, FiUpload, FiFileText, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { keyframes } from 'styled-components';

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  min-height: 100vh;
  background-color: #000;
  color: white;
  display: flex;
  flex-direction: column;
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
    animation: gridMove 20s linear infinite;
  }

  @keyframes gridMove {
    0% { transform: translateY(0); }
    100% { transform: translateY(30px); }
  }

  &::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 100vh;
    background: radial-gradient(circle at 50% 50%, 
      rgba(255, 107, 0, 0.1) 0%,
      rgba(0, 0, 0, 0) 70%);
    pointer-events: none;
    z-index: 1;
  }
`;

const Header = styled.header`
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3),
              0 0 10px rgba(255, 107, 0, 0.1);
  z-index: 10;
  padding: 0.75rem 1.5rem;
  height: 64px;
  position: sticky;
  top: 0;
  border-bottom: 1px solid rgba(255, 107, 0, 0.1);
`;

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(
    45deg,
    #ff6b00,
    #ff8533,
    #ff6b00
  );
  background-size: 200% auto;
  color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  animation: ${gradientAnimation} 3s linear infinite;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #ff6b00, transparent);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const ProfileForm = styled(motion.form)`
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 107, 0, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);

  h2 {
    color: #ff6b00;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(30, 30, 30, 0.8);
    border: 1px solid rgba(255, 107, 0, 0.2);
    border-radius: 8px;
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      outline: none;
      border-color: #ff6b00;
      box-shadow: 0 0 0 2px rgba(255, 107, 0, 0.2);
    }
  }

  .icon {
    position: absolute;
    right: 1rem;
    top: 2.5rem;
    color: #666;
  }
`;

const FileUpload = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }

  .upload-box {
    border: 2px dashed rgba(255, 107, 0, 0.2);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #ff6b00;
      background: rgba(255, 107, 0, 0.05);
    }

    .icon {
      font-size: 2rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    p {
      color: #666;
      margin: 0;
    }
  }

  input[type="file"] {
    display: none;
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(45deg, #ff6b00, #ff8533);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 2rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 107, 0, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: rgba(255, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 0, 0, 0.3);
  color: #ff4444;
`;

const TeacherProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    department: '',
    designation: '',
    years_of_experience: '',
    linkedin_profile: '',
  });
  const [files, setFiles] = useState({
    photo: null,
    resume: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      if (files.photo) {
        submitData.append('photo', files.photo);
      }
      if (files.resume) {
        submitData.append('resume', files.resume);
      }

      const response = await axios.post(
        'http://localhost:8000/api/teachers/profile/create/',
        submitData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      navigate('/teacher/pending-verification');
    } catch (err) {
      if (err.response?.data?.detail === 'Profile already exists') {
        navigate('/teacher/pending-verification');
        return;
      }

      if (err.response?.data) {
        const errorMessages = [];
        const errorData = err.response.data;
        
        if (typeof errorData === 'string') {
          errorMessages.push(errorData);
        } else {
          Object.entries(errorData).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errorMessages.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              errorMessages.push(`${field}: ${errors}`);
            }
          });
        }
        
        setError(errorMessages.join('\n'));
        return;
      }
      
      setError('An error occurred while creating your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <div className="header-content">
          <div className="left-section">
            <Logo>Complete Your Profile</Logo>
          </div>
        </div>
      </Header>

      <MainContent>
        <ProfileForm
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Teacher Profile</h2>
          <p>Please fill out your profile information. This will be reviewed by management.</p>

          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </ErrorMessage>
          )}

          <FormGroup>
            <label>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <FiUser className="icon" />
          </FormGroup>

          <FormGroup>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FiMail className="icon" />
          </FormGroup>

          <FormGroup>
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            />
            <FiBriefcase className="icon" />
          </FormGroup>

          <FormGroup>
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
            <FiAward className="icon" />
          </FormGroup>

          <FormGroup>
            <label>Years of Experience</label>
            <input
              type="number"
              name="years_of_experience"
              value={formData.years_of_experience}
              onChange={handleChange}
              required
              min="0"
              max="50"
            />
            <FiAward className="icon" />
          </FormGroup>

          <FormGroup>
            <label>LinkedIn Profile</label>
            <input
              type="url"
              name="linkedin_profile"
              value={formData.linkedin_profile}
              onChange={handleChange}
            />
            <FiLinkedin className="icon" />
          </FormGroup>

          <FileUpload>
            <label>Profile Photo (Optional)</label>
            <label className="upload-box" htmlFor="photo">
              <FiUpload className="icon" />
              <p>Click to upload photo</p>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </FileUpload>

          <FileUpload>
            <label>Resume (Required)</label>
            <label className="upload-box" htmlFor="resume">
              <FiFileText className="icon" />
              <p>Click to upload resume</p>
              <input
                type="file"
                id="resume"
                name="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
              />
            </label>
            <p style={{ color: '#666', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              Accepted formats: PDF, DOC, DOCX
            </p>
          </FileUpload>

          <SubmitButton type="submit" disabled={loading || !files.resume}>
            {loading ? 'Submitting...' : 'Submit Profile'}
            <FiArrowRight />
          </SubmitButton>
        </ProfileForm>
      </MainContent>
    </Container>
  );
};

export default TeacherProfile;