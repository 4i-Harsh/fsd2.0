import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  InputAdornment,
  Alert,
  Chip,
  Avatar,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
  Snackbar,
  alpha,
  Divider,
  Tooltip,
  IconButton,
  Checkbox,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  HourglassEmpty as HourglassEmptyIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  PersonSearch as PersonSearchIcon
} from '@mui/icons-material';

const ApplicationStatusManager = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [statusToUpdate, setStatusToUpdate] = useState('');
  const [comments, setComments] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    shortlisted: 0,
    interviewed: 0,
    rejected: 0,
    percentages: {
      pending: 0,
      shortlisted: 0,
      interviewed: 0,
      rejected: 0
    }
  });
  const [bulkStatus, setBulkStatus] = useState('');
  const [bulkComments, setBulkComments] = useState('');

  // Helper function to refresh token
  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refreshToken');
      if (!refresh) return null;

      const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access);
        return data.access;
      } else {
        // If refresh fails, clear tokens
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return null;
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  // Generic fetch function with token refresh
  const fetchWithAuth = async (url, options = {}) => {
    let token = localStorage.getItem('token');
    
    // Set default headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    
    // First attempt with current token
    let response = await fetch(url, {
      ...options,
      headers
    });
    
    // If 401, try to refresh token and retry
    if (response.status === 401) {
      console.log('Token expired, attempting refresh...');
      const newToken = await refreshToken();
      
      if (newToken) {
        // Retry with new token
        headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, {
          ...options,
          headers
        });
      }
    }
    
    return response;
  };

  // Fetch list of all internships
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        
        const response = await fetchWithAuth('http://127.0.0.1:8000/api/managements/internships/');
        
        if (response.ok) {
          const data = await response.json();
          setInternships(data);
          
          // Set first internship as default selected
          if (data.length > 0 && !selectedInternship) {
            setSelectedInternship(data[0].id);
          }
        } else {
          setError('Failed to fetch internships');
        }
      } catch (error) {
        console.error('Error fetching internships:', error);
        setError('Failed to load internships');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInternships();
  }, []);

  // Fetch applications for selected internship
  const fetchApplications = async () => {
    if (!selectedInternship) return;
    
    try {
      setLoading(true);
      
      const response = await fetchWithAuth(`http://127.0.0.1:8000/api/managements/internships/${selectedInternship}/applications/detail/`);
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
        setError('Failed to fetch applications');
      }
      
      // Fetch stats for this internship
      const statsResponse = await fetchWithAuth(`http://127.0.0.1:8000/api/managements/internships/${selectedInternship}/stats/`);
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          total: statsData.stats.total,
          pending: statsData.stats.pending,
          shortlisted: statsData.stats.shortlisted,
          interviewed: statsData.stats.interviewed || 0,
          rejected: statsData.stats.rejected,
          percentages: statsData.percentages
        });
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError('Failed to load student applications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications when selected internship changes
  useEffect(() => {
    fetchApplications();
  }, [selectedInternship]);

  // Handle opening of status update dialog
  const handleStatusUpdateDialog = (application) => {
    setCurrentApplication(application);
    setStatusToUpdate(application.status);
    setComments(application.comments || '');
    setDialogOpen(true);
  };

  // Handle status change
  const handleStatusChange = async (applicationId, newStatus, comment = '') => {
    try {
      const response = await fetchWithAuth(
        `http://127.0.0.1:8000/api/managements/applications/${applicationId}/update-status/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: newStatus,
            comments: comment
          })
        }
      );

      if (response.ok) {
        // Find the application being updated
        const appIndex = applications.findIndex(app => app.id === applicationId);
        if (appIndex !== -1) {
          const oldStatus = applications[appIndex].status;
          
          // Update application in state
          const updatedApplications = [...applications];
          updatedApplications[appIndex] = { 
            ...updatedApplications[appIndex], 
            status: newStatus,
            comments: comment || updatedApplications[appIndex].comments
          };
          setApplications(updatedApplications);
          
          // Update the stats with more detailed tracking
          setStats(prevStats => {
            const newStats = { ...prevStats };
            
            // Decrement old status count
            if (oldStatus) {
              newStats[oldStatus] = Math.max(0, (newStats[oldStatus] || 0) - 1);
            }
            
            // Increment new status count
            newStats[newStatus] = (newStats[newStatus] || 0) + 1;
            
            // Add transition tracking (from -> to)
            if (!newStats.transitions) {
              newStats.transitions = {};
            }
            
            // Track status transitions
            const transitionKey = `${oldStatus || 'new'}_to_${newStatus}`;
            newStats.transitions[transitionKey] = (newStats.transitions[transitionKey] || 0) + 1;
            
            // Recalculate percentages
            if (newStats.total > 0) {
              newStats.percentages = {
                pending: Math.round((newStats.pending / newStats.total) * 100),
                shortlisted: Math.round((newStats.shortlisted / newStats.total) * 100),
                interviewed: Math.round(((newStats.interviewed || 0) / newStats.total) * 100),
                rejected: Math.round((newStats.rejected / newStats.total) * 100)
              };
            }
            
            return newStats;
          });
          
          // Show a more informative snackbar message
          setSnackbarMessage(`Application status updated from ${oldStatus || 'new'} to ${newStatus}`);
          setSnackbarOpen(true);
          setDialogOpen(false);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      setError('An error occurred during status update');
    }
  };

  // Handle status dropdown change
  const handleBulkStatusChange = (event) => {
    setBulkStatus(event.target.value);
  };

  // Handle comments change
  const handleCommentsChange = (event) => {
    setBulkComments(event.target.value);
  };

  // Handle bulk update
  const handleBulkUpdate = async () => {
    if (selectedApplications.length === 0 || !bulkStatus) {
      setSnackbarMessage('Please select applications and a status');
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);
      
      // Get the selected application IDs
      const applicationIds = selectedApplications;
      
      // Make API call to update statuses
      const response = await fetchWithAuth(`http://127.0.0.1:8000/api/managements/applications/bulk-update/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          application_ids: applicationIds,
          status: bulkStatus,
          comments: bulkComments
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application statuses');
      }
      
      // Refresh applications data
      await fetchApplications();
      
      // Clear selections and status
      setSelectedApplications([]);
      setBulkStatus('');
      setBulkComments('');
      
      setSnackbarMessage(`Successfully updated ${applicationIds.length} applications to ${bulkStatus}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating applications:', error);
      setSnackbarMessage('Failed to update applications: ' + error.message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Filter applications based on search query
  const filteredApplications = applications.filter(application => {
    if (!application.student) return false;
    
    const fullName = application.student.full_name || '';
    const studentId = application.student.student_id || '';
    const department = application.student.department || '';
    const email = application.student.email || '';
    
    const query = searchQuery.toLowerCase();
    
    return fullName.toLowerCase().includes(query) || 
           studentId.toLowerCase().includes(query) || 
           department.toLowerCase().includes(query) ||
           email.toLowerCase().includes(query);
  });

  // Update refreshApplications to use the fetchApplications function that is now in scope
  const refreshApplications = async () => {
    setLoading(true);
    try {
      await fetchApplications();
      setSnackbarMessage('Applications refreshed successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error refreshing applications:', error);
      setSnackbarMessage('Failed to refresh applications');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading && internships.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: '#f97316' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4
      }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 'bold',
          color: 'white',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            bottom: -8,
            height: 4,
            width: 60,
            background: 'linear-gradient(90deg, #f97316 0%, rgba(249, 115, 22, 0) 100%)',
            borderRadius: 2
          }
        }}>
          Application Status Management
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(211, 47, 47, 0.15)',
            color: '#ff8a80',
            '& .MuiAlert-icon': {
              color: '#ff8a80'
            }
          }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Internship Selector */}
      <Paper sx={{
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        mb: 3
      }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Select Internship</Typography>
        <FormControl fullWidth>
          <InputLabel id="internship-select-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Internship</InputLabel>
          <Select
            labelId="internship-select-label"
            id="internship-select"
            value={selectedInternship}
            onChange={(e) => {
              setSelectedInternship(e.target.value);
              setSelectedApplications([]);
            }}
            sx={{
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(249, 115, 22, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#f97316',
              },
              '.MuiSvgIcon-root': {
                color: 'white',
              }
            }}
          >
            {internships.map((internship) => (
              <MenuItem key={internship.id} value={internship.id}>
                {internship.title} - {internship.company_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Application Statistics Dashboard */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3} lg={2.4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at 10% 10%, ${alpha('#f97316', 0.15)}, transparent 80%)`,
                zIndex: 0
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px',
                bgcolor: 'rgba(249, 115, 22, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <AssignmentIcon sx={{ color: '#f97316', fontSize: 28 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Total Applications
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} lg={2.4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at 10% 10%, ${alpha('#fb8c00', 0.15)}, transparent 80%)`,
                zIndex: 0
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px',
                bgcolor: 'rgba(251, 140, 0, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <HourglassEmptyIcon sx={{ color: '#fb8c00', fontSize: 28 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                {stats.pending}
                <Typography component="span" variant="body1" sx={{ fontSize: '1rem', ml: 1, color: 'rgba(255,255,255,0.6)' }}>
                  ({stats.percentages.pending}%)
                </Typography>
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Pending Applications
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} lg={2.4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at 10% 10%, ${alpha('#2e7d32', 0.15)}, transparent 80%)`,
                zIndex: 0
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px',
                bgcolor: 'rgba(46, 125, 50, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <ThumbUpIcon sx={{ color: '#2e7d32', fontSize: 28 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                {stats.shortlisted}
                <Typography component="span" variant="body1" sx={{ fontSize: '1rem', ml: 1, color: 'rgba(255,255,255,0.6)' }}>
                  ({stats.percentages.shortlisted}%)
                </Typography>
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Shortlisted Applications
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} lg={2.4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at 10% 10%, ${alpha('#d32f2f', 0.15)}, transparent 80%)`,
                zIndex: 0
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px',
                bgcolor: 'rgba(211, 47, 47, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <ThumbDownIcon sx={{ color: '#d32f2f', fontSize: 28 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                {stats.rejected}
                <Typography component="span" variant="body1" sx={{ fontSize: '1rem', ml: 1, color: 'rgba(255,255,255,0.6)' }}>
                  ({stats.percentages.rejected}%)
                </Typography>
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Rejected Applications
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} lg={2.4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              height: '100%',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at 10% 10%, ${alpha('#0288d1', 0.15)}, transparent 80%)`,
                zIndex: 0
              }
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px',
                bgcolor: 'rgba(2, 136, 209, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}>
                <PersonSearchIcon sx={{ color: '#0288d1', fontSize: 28 }} />
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                {stats.interviewed || 0}
                <Typography component="span" variant="body1" sx={{ fontSize: '1rem', ml: 1, color: 'rgba(255,255,255,0.6)' }}>
                  ({stats.percentages.interviewed || 0}%)
                </Typography>
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Interviewed Applications
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Bulk Actions */}
      <Paper sx={{
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        mb: 3
      }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Bulk Actions</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Bulk Actions ({selectedApplications.length} selected)
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel id="bulk-status-label">Set Status</InputLabel>
                <Select
                  labelId="bulk-status-label"
                  id="bulk-status"
                  value={bulkStatus}
                  onChange={handleBulkStatusChange}
                  label="Set Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="shortlisted">Shortlisted</MenuItem>
                  <MenuItem value="interviewed">Interviewed</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Comments (optional)"
                value={bulkComments}
                onChange={handleCommentsChange}
                sx={{ minWidth: 250 }}
              />
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                disabled={selectedApplications.length === 0 || !bulkStatus}
                onClick={handleBulkUpdate}
              >
                Update Applications
              </Button>
            </Box>
          </Box>
          
          <Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={refreshApplications}
                startIcon={<RefreshIcon />}
              >
                Refresh
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Applications List */}
      <Paper sx={{
        p: 3,
        borderRadius: 2,
        background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        mb: 4
      }}>
        <TextField
          fullWidth
          placeholder="Search students by name, ID, department or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(249, 115, 22, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#f97316',
              },
            },
          }}
        />

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress sx={{ color: '#f97316' }} />
          </Box>
        )}

        {!loading && filteredApplications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: 'rgba(255,255,255,0.6)' }}>
            <SchoolIcon sx={{ fontSize: 48, opacity: 0.6, mb: 2 }} />
            <Typography>
              {searchQuery 
                ? 'No applications match your search criteria' 
                : 'No applications found for this internship'}
            </Typography>
          </Box>
        ) : (
          <TableContainer 
            sx={{ 
              '& .MuiTableCell-root': {
                borderColor: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedApplications.length > 0 && selectedApplications.length < filteredApplications.length}
                      checked={filteredApplications.length > 0 && selectedApplications.length === filteredApplications.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedApplications(filteredApplications.map(app => app.id));
                        } else {
                          setSelectedApplications([]);
                        }
                      }}
                      sx={{
                        color: 'rgba(255,255,255,0.5)',
                        '&.Mui-checked': {
                          color: '#f97316',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Student</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Student ID</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Applied On</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Resume</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((application) => {
                  if (!application.student) return null;
                  
                  const student = application.student;
                  const isSelected = selectedApplications.includes(application.id);
                  
                  // Generate a consistent color from student ID
                  const colorHash = student.student_id?.split('').reduce(
                    (acc, char) => acc + char.charCodeAt(0), 0
                  ) % 360 || 0;
                  
                  const avatarColor = `hsl(${colorHash}, 70%, 50%)`;
                  const avatarText = student.full_name 
                    ? student.full_name.charAt(0).toUpperCase() 
                    : 'S';
                    
                  return (
                    <TableRow 
                      key={application.id}
                      selected={isSelected}
                      hover
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.03)'
                        },
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(249, 115, 22, 0.15)'
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: 'rgba(249, 115, 22, 0.2)'
                        }
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedApplications([...selectedApplications, application.id]);
                            } else {
                              setSelectedApplications(selectedApplications.filter(id => id !== application.id));
                            }
                          }}
                          sx={{
                            color: 'rgba(255,255,255,0.5)',
                            '&.Mui-checked': {
                              color: '#f97316',
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={student.profile_pic} 
                            sx={{ 
                              bgcolor: avatarColor,
                              mr: 2
                            }}
                          >
                            {avatarText}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {student.full_name || 'Student'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                              {student.email || 'No email'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {student.student_id}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {student.department || student.dept_of_study || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {new Date(application.applied_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={
                            application.status === 'shortlisted' ? 'Shortlisted' :
                            application.status === 'interviewed' ? 'Interviewed' :
                            application.status === 'rejected' ? 'Rejected' : 
                            'Pending'
                          }
                          size="small"
                          sx={{
                            bgcolor: 
                              application.status === 'shortlisted' ? 'rgba(46, 125, 50, 0.2)' :
                              application.status === 'interviewed' ? 'rgba(2, 136, 209, 0.2)' :
                              application.status === 'rejected' ? 'rgba(211, 47, 47, 0.2)' :
                              'rgba(237, 108, 2, 0.2)',
                            color: 
                              application.status === 'shortlisted' ? '#66bb6a' :
                              application.status === 'interviewed' ? '#29b6f6' :
                              application.status === 'rejected' ? '#ef5350' :
                              '#fb8c00',
                            border: '1px solid',
                            borderColor: 
                              application.status === 'shortlisted' ? 'rgba(46, 125, 50, 0.5)' :
                              application.status === 'interviewed' ? 'rgba(2, 136, 209, 0.5)' :
                              application.status === 'rejected' ? 'rgba(211, 47, 47, 0.5)' :
                              'rgba(237, 108, 2, 0.5)',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {application.resume_url ? (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DescriptionIcon />}
                            href={application.resume_url}
                            target="_blank"
                            sx={{
                              color: '#3b82f6',
                              borderColor: 'rgba(59, 130, 246, 0.5)',
                              '&:hover': {
                                borderColor: '#3b82f6',
                                bgcolor: 'rgba(59, 130, 246, 0.1)'
                              }
                            }}
                          >
                            View
                          </Button>
                        ) : (
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                            Not available
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handleStatusUpdateDialog(application)}
                          sx={{
                            color: '#f97316',
                            '&:hover': {
                              bgcolor: 'rgba(249, 115, 22, 0.1)'
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Status Update Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: '#121212',
            color: 'white',
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.05)',
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          Update Application Status
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {currentApplication && (
            <Box sx={{ minWidth: 400 }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
                {currentApplication.student?.full_name || 'Student'} - {currentApplication.student?.student_id}
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="status-select-label" sx={{ color: 'rgba(255,255,255,0.7)' }}>Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={statusToUpdate}
                  onChange={(e) => setStatusToUpdate(e.target.value)}
                  label="Status"
                  sx={{
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(249, 115, 22, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f97316',
                    },
                    '.MuiSvgIcon-root': {
                      color: 'white',
                    }
                  }}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="shortlisted">Shortlisted</MenuItem>
                  <MenuItem value="interviewed">Interviewed</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body2" sx={{ mb: 1 }}>Comments/Feedback</Typography>
              <TextareaAutosize
                minRows={4}
                placeholder="Enter feedback or notes about this application"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  borderRadius: '4px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '8px 12px',
                  fontFamily: 'inherit',
                  fontSize: '0.875rem',
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', p: 2 }}>
          <Button 
            onClick={() => setDialogOpen(false)}
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => handleStatusChange(currentApplication.id, statusToUpdate, comments)}
            variant="contained"
            sx={{ 
              bgcolor: '#f97316',
              '&:hover': {
                bgcolor: '#ea580c'
              }
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        ContentProps={{
          sx: {
            bgcolor: '#2e7d32',
            color: 'white'
          }
        }}
      />
    </Box>
  );
};

export default ApplicationStatusManager; 