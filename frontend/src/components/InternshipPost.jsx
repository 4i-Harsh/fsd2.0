import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Snackbar,
  Divider,
  InputAdornment,
  Chip,
  IconButton,
  alpha
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  BusinessCenter as BusinessIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  EventNote as EventIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  Check as CheckIcon,
  AttachMoney as MoneyIcon,
  Send as SendIcon,
  Assignment as AssignmentIcon,
  MenuBook as MenuBookIcon,
  Work as WorkIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

const InternshipPost = () => {
  const [formData, setFormData] = useState({
    title: '',
    company_name: '',
    description: '',
    location: '',
    start_date: null,
    end_date: null,
    application_deadline: null,
    details: {
      requirements: '',
      responsibilities: '',
      benefits: '',
      stipend: '',
      duration: '',
      skills_required: ''
    }
  });

  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('details.')) {
      const detailField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        details: {
          ...prev.details,
          [detailField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleDateChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Format dates to YYYY-MM-DD format
      const formatDate = (date) => {
        if (!date) return null;
        return date.toISOString().split('T')[0];
      };

      const formattedData = {
        ...formData,
        start_date: formatDate(formData.start_date),
        end_date: formatDate(formData.end_date),
        application_deadline: formatDate(formData.application_deadline)
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/managements/internships/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create internship');
      }

      const data = await response.json();
      setAlert({
        open: true,
        message: 'Internship posted successfully!',
        severity: 'success'
      });

      // Clear form
      setFormData({
        title: '',
        company_name: '',
        description: '',
        location: '',
        start_date: null,
        end_date: null,
        application_deadline: null,
        details: {
          requirements: '',
          responsibilities: '',
          benefits: '',
          stipend: '',
          duration: '',
          skills_required: ''
        }
      });

    } catch (error) {
      setAlert({
        open: true,
        message: error.message || 'Failed to post internship',
        severity: 'error'
      });
    }
  };

  const CustomInput = ({
    name,
    value,
    placeholder,
    icon,
    required = true,
    multiline = false,
    rows = 1,
    label = ''
  }) => (
    <Box sx={{ width: '100%' }}>
      {label && (
        <Typography 
          variant="body2" 
          component="label" 
          htmlFor={name}
          sx={{ 
            display: 'block', 
            mb: 1, 
            color: 'white',
            fontSize: '0.9rem',
            '& .required': {
              color: '#f97316',
              ml: 0.5
            }
          }}
        >
          {label}
          {required && <span className="required">*</span>}
        </Typography>
      )}
      <TextField
        fullWidth
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        required={required}
        multiline={multiline}
        rows={rows}
        placeholder={placeholder}
        variant="outlined"
        InputProps={{
          startAdornment: icon ? (
            <InputAdornment position="start">
              {icon}
            </InputAdornment>
          ) : null,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            borderRadius: '10px',
            '& fieldset': {
              borderColor: 'rgba(249, 115, 22, 0.2)',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(249, 115, 22, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#f97316',
            },
            fontSize: '0.9rem',
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#f97316',
          },
          '& .MuiInputAdornment-root .MuiSvgIcon-root': {
            color: 'rgba(249, 115, 22, 0.8)',
          },
        }}
      />
    </Box>
  );

  const CustomDatePicker = ({ name, value, label, required = true }) => (
    <Box sx={{ width: '100%' }}>
      <Box 
        sx={{ 
          backgroundColor: '#d35400',
          color: 'white',
          px: 1.5,
          py: 1,
          borderRadius: '4px 4px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <CalendarIcon fontSize="small" />
        <Typography variant="body2" fontWeight="medium">{label}</Typography>
      </Box>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={value}
          onChange={(date) => handleDateChange(name, date)}
          renderInput={(params) => (
            <TextField 
              {...params} 
              fullWidth 
              required={required}
              placeholder={`Select ${label.toLowerCase()}`}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  borderRadius: '0 0 10px 10px',
                  '& fieldset': {
                    borderColor: 'rgba(249, 115, 22, 0.4)',
                    borderTopWidth: 0,
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(249, 115, 22, 0.6)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#f97316',
                  },
                },
                '& .MuiInputLabel-root': {
                  display: 'none',
                },
                '& .MuiSvgIcon-root': {
                  color: 'rgba(249, 115, 22, 0.8)',
                },
              }}
            />
          )}
        />
      </LocalizationProvider>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100%',
        pb: 4,
        backgroundColor: 'black',
        backgroundImage: `
          radial-gradient(at 10% 10%, rgba(249, 115, 22, 0.05) 0px, transparent 50%),
          radial-gradient(at 90% 90%, rgba(249, 115, 22, 0.05) 0px, transparent 50%)
        `,
        backgroundSize: '100% 100%',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Retro Grid Background */}
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
          top: '5%',
          right: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <Box 
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(249, 115, 22, 0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />

      <Container maxWidth="xl">
        <Paper 
          elevation={0} 
          sx={{
            mt: 2,
            borderRadius: '16px',
            background: 'linear-gradient(145deg, rgba(0,0,0,0.7) 0%, rgba(25,25,25,0.8) 100%)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(249, 115, 22, 0.05)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Orange top border */}
          <Box 
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, #f97316, rgba(249, 115, 22, 0.3))',
              zIndex: 0
            }}
          />

          {/* Header */}
          <Box 
            sx={{ 
              px: 3, 
              py: 2, 
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box 
              sx={{
                width: 50,
                height: 50,
                borderRadius: '12px',
                backgroundColor: 'rgba(249, 115, 22, 0.05)',
                border: '1px solid rgba(249, 115, 22, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BusinessIcon 
                sx={{ 
                  color: '#f97316',
                  fontSize: 30
                }} 
              />
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 'bold', 
                color: 'white',
                '& .highlight': {
                  color: '#f97316'
                }
              }}
            >
              Post New <span className="highlight">Internship</span>
            </Typography>
          </Box>

          <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={() => setAlert({ ...alert, open: false })}
          >
            <Alert 
              onClose={() => setAlert({ ...alert, open: false })} 
              severity={alert.severity} 
              sx={{ 
                width: '100%',
                ...(alert.severity === 'success' ? {
                  backgroundColor: 'rgba(46, 125, 50, 0.9)',
                  color: '#fff',
                  '& .MuiAlert-icon': {
                    color: '#fff'
                  }
                } : {
                  backgroundColor: 'rgba(211, 47, 47, 0.9)',
                  color: '#fff',
                  '& .MuiAlert-icon': {
                    color: '#fff'
                  }
                })
              }}
            >
              {alert.message}
            </Alert>
          </Snackbar>

          <form onSubmit={handleSubmit}>
            {/* Basic Information Section */}
            <Box 
              sx={{ 
                px: 3,
                py: 3,
                borderTop: '1px solid rgba(249, 115, 22, 0.1)',
                borderBottom: '1px solid rgba(249, 115, 22, 0.1)',
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  gap: 1.5,
                  pl: 1
                }}
              >
                <AssignmentIcon 
                  sx={{ 
                    color: '#f97316',
                    fontSize: 26
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'white',
                  }}
                >
                  Basic Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <CustomInput 
                    name="title"
                    value={formData.title}
                    placeholder="e.g. Frontend Developer Internship"
                    icon={<BusinessIcon />}
                    label="Internship Title"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomInput 
                    name="company_name"
                    value={formData.company_name}
                    placeholder="e.g. Tech Solutions Inc."
                    icon={<BusinessIcon />}
                    label="Company Name"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomInput 
                    name="location"
                    value={formData.location}
                    placeholder="e.g. New York, NY (or Remote)"
                    icon={<LocationIcon />}
                    label="Location"
                    required={false}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomInput 
                    name="description"
                    value={formData.description}
                    placeholder="Provide a brief overview of the internship position..."
                    icon={<DescriptionIcon />}
                    multiline
                    rows={4}
                    label="Description"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Timeline Information Section */}
            <Box 
              sx={{ 
                px: 3,
                py: 3,
                borderBottom: '1px solid rgba(249, 115, 22, 0.1)'
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  gap: 1.5,
                  pl: 1
                }}
              >
                <EventIcon 
                  sx={{ 
                    color: '#f97316',
                    fontSize: 26
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'white'
                  }}
                >
                  Timeline Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <CustomDatePicker 
                    name="start_date" 
                    value={formData.start_date}
                    label="Start Date"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomDatePicker 
                    name="end_date" 
                    value={formData.end_date}
                    label="End Date"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <CustomDatePicker 
                    name="application_deadline"
                    value={formData.application_deadline}
                    label="Application Deadline"
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Internship Details Section */}
            <Box 
              sx={{ 
                px: 3, 
                py: 3, 
              }}
            >
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  mb: 3,
                  gap: 1.5,
                  pl: 1
                }}
              >
                <SettingsIcon 
                  sx={{ 
                    color: '#f97316',
                    fontSize: 26
                  }} 
                />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'white',
                  }}
                >
                  Internship Details
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <CustomInput 
                    name="details.requirements"
                    value={formData.details.requirements}
                    placeholder="List the qualifications and requirements..."
                    icon={<MenuBookIcon />}
                    multiline
                    rows={3}
                    label="Requirements"
                    required={false}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomInput 
                    name="details.responsibilities"
                    value={formData.details.responsibilities}
                    placeholder="Describe the intern's responsibilities..."
                    icon={<AssignmentIcon />}
                    multiline
                    rows={3}
                    label="Responsibilities"
                    required={false}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomInput 
                    name="details.benefits"
                    value={formData.details.benefits}
                    placeholder="List perks and benefits offered..."
                    icon={<CheckIcon />}
                    multiline
                    rows={3}
                    label="Benefits"
                    required={false}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomInput 
                    name="details.skills_required"
                    value={formData.details.skills_required}
                    placeholder="List technical or soft skills needed..."
                    icon={<CodeIcon />}
                    multiline
                    rows={3}
                    label="Skills Required"
                    required={false}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomInput 
                    name="details.stipend"
                    value={formData.details.stipend}
                    placeholder="e.g. $1000/month or Unpaid"
                    icon={<MoneyIcon />}
                    label="Stipend"
                    required={false}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomInput 
                    name="details.duration"
                    value={formData.details.duration}
                    placeholder="e.g. 3 months, 6 months"
                    icon={<EventIcon />}
                    label="Duration"
                    required={false}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  endIcon={<SendIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
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
                  Post Internship
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default InternshipPost; 