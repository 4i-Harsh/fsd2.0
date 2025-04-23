import React, { useState, useEffect } from 'react';
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
  InputAdornment,
  IconButton,
  Fade
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  School as SchoolIcon
} from '@mui/icons-material';

const TeacherLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8000/api/teachers/login/',
        formData
      );

      const { token, profile_status } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userType', 'teacher');

      // Redirect based on profile and verification status
      if (!profile_status.has_profile) {
        navigate('/teacher/profile');
      } else if (profile_status.verification_status === 'pending') {
        navigate('/teacher/pending-verification');
      } else if (profile_status.verification_status === 'approved') {
        navigate('/teacher/dashboard');
      } else {
        setError('Your profile has been rejected. Please contact management.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'black',
          backgroundImage: `
            radial-gradient(at 10% 10%, rgba(249, 115, 22, 0.1) 0px, transparent 50%),
            radial-gradient(at 90% 90%, rgba(249, 115, 22, 0.05) 0px, transparent 50%)
          `,
        }}
      >
        <Box 
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '3px solid transparent',
            borderTopColor: '#f97316',
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }}
        />
      </Box>
    );
  }

  return (
    <Box 
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'black',
        backgroundImage: `
          radial-gradient(at 10% 10%, rgba(249, 115, 22, 0.05) 0px, transparent 50%),
          radial-gradient(at 90% 90%, rgba(249, 115, 22, 0.05) 0px, transparent 50%)
        `,
        backgroundSize: '100% 100%',
        backgroundAttachment: 'fixed',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Grid */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(249, 115, 22, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Orange blob effects */}
      <Box 
        sx={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          animation: 'pulse 15s infinite alternate ease-in-out',
          '@keyframes pulse': {
            '0%': { opacity: 0.4, transform: 'scale(1)' },
            '100%': { opacity: 0.8, transform: 'scale(1.05)' }
          },
          zIndex: 0
        }}
      />
      
      <Box 
        sx={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(60px)',
          animation: 'pulse2 20s infinite alternate-reverse ease-in-out',
          '@keyframes pulse2': {
            '0%': { opacity: 0.3, transform: 'scale(1)' },
            '100%': { opacity: 0.7, transform: 'scale(1.1)' }
          },
          zIndex: 0
        }}
      />

      <Container 
        maxWidth="xs" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1,
          height: '100%'
        }}
      >
        <Fade in={true} timeout={1000}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: '1px solid rgba(249, 115, 22, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 15px rgba(249, 115, 22, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              mt: -6
            }}
          >
            {/* Orange top border */}
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #f97316, #fb923c)',
                zIndex: 1
              }}
            />

            <Box sx={{ textAlign: 'center', mb: 4, mt: 1 }}>
              <Box 
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(249, 115, 22, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  mb: 2,
                  boxShadow: '0 0 20px rgba(249, 115, 22, 0.15)'
                }}
              >
                <SchoolIcon 
                  sx={{ 
                    fontSize: 36, 
                    color: '#f97316'
                  }}
                />
              </Box>
              <Typography 
                variant="h4" 
                sx={{
                  fontWeight: 'bold',
                  color: '#fff',
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    color: '#f97316',
                    background: 'linear-gradient(90deg, #f97316, #fb923c)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Teacher
                </Box> Login
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'rgba(255, 255, 255, 0.6)' }}>
                Access your teaching dashboard
              </Typography>
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  backgroundColor: 'rgba(211, 47, 47, 0.1)', 
                  color: '#ff8a80',
                  border: '1px solid rgba(211, 47, 47, 0.2)',
                  '& .MuiAlert-icon': {
                    color: '#ff8a80'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'rgba(249, 115, 22, 0.8)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(249, 115, 22, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(249, 115, 22, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f97316',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#f97316',
                    },
                  }}
                />
              </Box>
              <Box sx={{ mb: 1 }}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'rgba(249, 115, 22, 0.8)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(249, 115, 22, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(249, 115, 22, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f97316',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#f97316',
                    },
                  }}
                />
              </Box>
              <Typography 
                variant="body2" 
                align="right" 
                sx={{ 
                  mb: 3, 
                  color: 'rgba(249, 115, 22, 0.8)',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Forgot password?
              </Typography>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.5,
                  background: 'linear-gradient(90deg, #f97316, #ea580c)',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                    transition: '0.5s',
                  },
                  '&:hover': {
                    background: 'linear-gradient(90deg, #ea580c, #c2410c)',
                    boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)',
                    '&:before': {
                      left: '100%',
                    },
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default TeacherLogin; 