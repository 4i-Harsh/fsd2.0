import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Fade,
  Grow
} from '@mui/material';
import { 
  HourglassEmpty as HourglassIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

const PendingVerification = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    // Simulate progress animation
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => 
        prevProgress >= 100 ? 0 : prevProgress + 10
      );
    }, 600);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  if (loading) {
    return (
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(145deg, #000000 0%, #111111 100%)',
          backgroundImage: `
            radial-gradient(at 10% 10%, rgba(249, 115, 22, 0.1) 0px, transparent 50%),
            radial-gradient(at 90% 90%, rgba(249, 115, 22, 0.05) 0px, transparent 50%)
          `,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Grid background */}
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
            backgroundSize: '20px 20px',
            zIndex: 0
          }}
        />
        
        <CircularProgress 
          variant="determinate" 
          value={progress}
          size={80}
          thickness={2}
          sx={{ 
            color: '#f97316',
            position: 'relative',
            zIndex: 1,
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              border: '8px solid rgba(249, 115, 22, 0.1)',
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
        justifyContent: 'center',
        alignItems: 'center',
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
            linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          zIndex: 0
        }}
      />

      {/* Background decorative elements */}
      <Box 
        sx={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <Box 
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />

      {/* Diagonal decorative line */}
      <Box 
        sx={{
          position: 'absolute',
          top: '0',
          right: '10%',
          width: '1px',
          height: '100vh',
          background: 'linear-gradient(to bottom, transparent, rgba(249, 115, 22, 0.2), transparent)',
          transform: 'rotate(15deg)',
          transformOrigin: 'top',
          zIndex: 0
        }}
      />

      <Box 
        sx={{
          position: 'absolute',
          top: '0',
          left: '25%',
          width: '1px',
          height: '100vh',
          background: 'linear-gradient(to bottom, transparent, rgba(249, 115, 22, 0.1), transparent)',
          transform: 'rotate(-10deg)',
          transformOrigin: 'top',
          zIndex: 0
        }}
      />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={1000}>
          <Paper 
            elevation={0} 
            sx={{
              p: 5,
              width: '100%',
              textAlign: 'center',
              background: 'linear-gradient(145deg, rgba(0,0,0,0.9) 0%, rgba(20,20,20,0.85) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(249, 115, 22, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(249, 115, 22, 0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Orange accent at top */}
            <Box 
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #f97316, rgba(249, 115, 22, 0.3))',
                zIndex: 2
              }}
            />
            
            {/* Corner glows */}
            <Box 
              sx={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
                filter: 'blur(10px)',
                zIndex: 0
              }}
            />
            
            <Box 
              sx={{
                position: 'absolute',
                bottom: '-10px',
                left: '-10px',
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
                filter: 'blur(10px)',
                zIndex: 0
              }}
            />

            <Box 
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 1
              }}
            >
              <Grow in={true} timeout={1000}>
                <Box 
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 4,
                    position: 'relative',
                    boxShadow: '0 0 40px rgba(249, 115, 22, 0.15), inset 0 0 15px rgba(249, 115, 22, 0.1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -5,
                      left: -5,
                      right: -5,
                      bottom: -5,
                      borderRadius: '50%',
                      border: '2px dashed rgba(249, 115, 22, 0.3)',
                      animation: 'rotate 15s linear infinite',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: -10,
                      left: -10,
                      right: -10,
                      bottom: -10,
                      borderRadius: '50%',
                      border: '1px dashed rgba(249, 115, 22, 0.15)',
                      animation: 'rotate 25s linear infinite reverse',
                    },
                    '@keyframes rotate': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                >
                  <HourglassIcon 
                    sx={{ 
                      fontSize: 60, 
                      color: '#f97316',
                      filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))'
                    }} 
                  />
                </Box>
              </Grow>
              
              <Typography 
                variant="h4" 
                gutterBottom
                sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  mb: 2,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -5,
                    left: '25%',
                    width: '50%',
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.8), transparent)',
                  }
                }}
              >
                Profile <span style={{ color: '#f97316' }}>Under Review</span>
              </Typography>
              
              <Fade in={true} timeout={1500}>
                <Box 
                  sx={{
                    p: 3.5,
                    borderRadius: '12px',
                    backgroundColor: 'rgba(20, 20, 20, 0.5)',
                    border: '1px solid rgba(249, 115, 22, 0.15)',
                    mb: 4,
                    maxWidth: '90%',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(145deg, rgba(249, 115, 22, 0.05) 0%, transparent 100%)',
                      borderRadius: '12px',
                    }
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2, 
                      color: 'rgba(255, 255, 255, 0.9)',
                      lineHeight: 1.7,
                      fontSize: '1.05rem',
                      fontWeight: 400,
                    }}
                  >
                    Your profile has been submitted and is currently under review by management.
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.7
                    }}
                  >
                    You will be notified once your profile is approved. After approval, you will have 
                    access to the teacher dashboard and all features.
                  </Typography>
                </Box>
              </Fade>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  py: 1.5,
                  px: 3,
                  borderRadius: '30px',
                  background: 'rgba(249, 115, 22, 0.08)',
                  border: '1px solid rgba(249, 115, 22, 0.2)'
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: 24,
                    height: 24,
                  }}
                >
                  <CircularProgress 
                    size={24} 
                    thickness={5}
                    sx={{ 
                      color: '#f97316',
                      position: 'absolute',
                      left: 0,
                      animation: 'pulse 1.5s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 0.6 },
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0.6 }
                      }
                    }} 
                  />
                  <AccessTimeIcon 
                    sx={{ 
                      color: 'rgba(249, 115, 22, 0.8)',
                      fontSize: 15,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }} 
                  />
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(249, 115, 22, 0.9)',
                    fontWeight: 500,
                    letterSpacing: '0.5px'
                  }}
                >
                  Waiting for approval...
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default PendingVerification; 