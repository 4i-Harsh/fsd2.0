import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  Input
} from '@mui/material';

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
      
      // Create FormData object to handle file uploads
      const submitData = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      // Add files if selected
      if (files.photo) {
        submitData.append('photo', files.photo);
      }
      if (files.resume) {
        submitData.append('resume', files.resume);
      }

      // Debug log to see what's being sent
      console.log('Submitting form data:', {
        formData: Object.fromEntries(submitData.entries()),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      try {
        const response = await axios.post(
          'http://localhost:8000/api/teachers/profile/create/',
          submitData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'  // Important for file uploads
            }
          }
        );
        console.log('Success response:', response.data);
        navigate('/teacher/pending-verification');
      } catch (err) {
        // Log the full error response for debugging
        console.error('Error response:', {
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers
        });

        // If profile already exists, redirect to pending verification page
        if (err.response?.data?.detail === 'Profile already exists') {
          navigate('/teacher/pending-verification');
          return;
        }

        // Handle validation errors
        if (err.response?.data) {
          const errorMessages = [];
          const errorData = err.response.data;
          
          // Handle both string and object error responses
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
        
        throw err;  // Re-throw other errors to be caught by outer catch block
      }
    } catch (err) {
      console.error('Profile creation error:', err);
      setError(
        'An error occurred while creating your profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Complete Your Profile
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Please fill out your profile information. This will be reviewed by management.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Years of Experience"
              name="years_of_experience"
              type="number"
              value={formData.years_of_experience}
              onChange={handleChange}
              required
              margin="normal"
              inputProps={{ min: 0, max: 50 }}
            />
            <TextField
              fullWidth
              label="LinkedIn Profile"
              name="linkedin_profile"
              value={formData.linkedin_profile}
              onChange={handleChange}
              margin="normal"
            />
            
            {/* File Upload Fields */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Profile Photo (Optional)
              </Typography>
              <Input
                type="file"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                fullWidth
              />
            </Box>

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Resume (Required)
              </Typography>
              <Input
                type="file"
                name="resume"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                required
                fullWidth
              />
              <Typography variant="caption" color="textSecondary">
                Accepted formats: PDF, DOC, DOCX
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={loading || !files.resume}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Profile'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default TeacherProfile; 