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
  alpha,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Apartment as ApartmentIcon,
  Description as DescriptionIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

// Sample data to use when API calls fail
const SAMPLE_INTERNSHIPS = [
  {
    id: 1,
    title: "Full Stack Developer Intern",
    company_name: "Tech Innovations Inc.",
    description: "Join our dynamic team to develop cutting-edge web applications.",
    location: "Remote / New York",
    start_date: "2024-06-01",
    end_date: "2024-08-31",
    application_deadline: "2024-05-15"
  },
  {
    id: 2,
    title: "Data Science Intern",
    company_name: "DataSmart Solutions",
    description: "Work on real-world data analysis projects.",
    location: "San Francisco, CA",
    start_date: "2024-06-15",
    end_date: "2024-09-15",
    application_deadline: "2024-05-30"
  }
];

const SAMPLE_APPLICATIONS = [
  {
    student_id: "STU001",
    full_name: "John Smith",
    email: "john.smith@example.com",
    department: "Computer Science",
    year: 3,
    status: "pending",
    applied_at: "2024-04-10T10:30:00Z",
    resume: null
  },
  {
    student_id: "STU002",
    full_name: "Emma Johnson",
    email: "emma.johnson@example.com",
    department: "Data Science",
    year: 2,
    status: "shortlisted",
    applied_at: "2024-04-08T14:45:00Z",
    resume: null
  },
  {
    student_id: "STU003",
    full_name: "Michael Brown",
    email: "michael.brown@example.com",
    department: "Computer Engineering",
    year: 4,
    status: "rejected",
    applied_at: "2024-04-05T09:15:00Z",
    resume: null
  }
];

const ApplicationsList = () => {
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedInternship, setSelectedInternship] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [usingSampleData, setUsingSampleData] = useState(false);

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
  const fetchWithAuth = async (url) => {
    let token = localStorage.getItem('token');
    
    // First attempt with current token
    let response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    // If 401, try to refresh token and retry
    if (response.status === 401) {
      console.log('Token expired, attempting refresh...');
      const newToken = await refreshToken();
      
      if (newToken) {
        // Retry with new token
        token = newToken;
        response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
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
        console.log('Fetching internships...');
        
        // Try the primary API endpoint
        try {
          const response = await fetchWithAuth('http://127.0.0.1:8000/api/managements/internships/');
          
          if (response.ok) {
            const data = await response.json();
            console.log('Successfully fetched internships:', data);
            setInternships(data);
            
            // Set first internship as default selected
            if (data.length > 0 && !selectedInternship) {
              setSelectedInternship(data[0].id);
            }
            return;
          } else {
            console.error('Internships response not OK:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error in primary internship endpoint:', error);
        }
        
        // Try alternative API endpoint
        try {
          const altResponse = await fetchWithAuth('http://127.0.0.1:8000/api/students/internships/');
          
          if (altResponse.ok) {
            const data = await altResponse.json();
            console.log('Successfully fetched internships from alt endpoint:', data);
            setInternships(data);
            
            // Set first internship as default selected
            if (data.length > 0 && !selectedInternship) {
              setSelectedInternship(data[0].id);
            }
            return;
          } else {
            console.error('Alt internships response not OK:', altResponse.status, altResponse.statusText);
          }
        } catch (error) {
          console.error('Error in alternative internship endpoint:', error);
        }
        
        // If both API calls fail, use sample data
        console.log('Using sample internship data due to API failure');
        setInternships(SAMPLE_INTERNSHIPS);
        if (!selectedInternship) {
          setSelectedInternship(SAMPLE_INTERNSHIPS[0].id);
        }
        setUsingSampleData(true);
        
      } catch (error) {
        console.error('Error fetching internships:', error);
        setError('Failed to load internships. Using sample data.');
        setInternships(SAMPLE_INTERNSHIPS);
        if (!selectedInternship) {
          setSelectedInternship(SAMPLE_INTERNSHIPS[0].id);
        }
        setUsingSampleData(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInternships();
  }, []);

  // Fetch applications for selected internship
  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedInternship) return;
      
      try {
        setLoading(true);
        console.log(`Fetching applications for internship ${selectedInternship}...`);
        
        // If we're using sample data, just use sample applications
        if (usingSampleData) {
          console.log('Using sample application data');
          setApplications(SAMPLE_APPLICATIONS);
          return;
        }
        
        // Try the primary API endpoint
        try {
          const response = await fetchWithAuth(`http://127.0.0.1:8000/api/managements/internships/${selectedInternship}/applications/`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Successfully fetched applications:', data);
            setApplications(data);
            return;
          } else {
            console.error('Applications response not OK:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('Error in primary applications endpoint:', error);
        }
        
        // If API call fails, use sample data
        console.log('Using sample applications data due to API failure');
        setApplications(SAMPLE_APPLICATIONS);
        
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load student applications. Using sample data.');
        setApplications(SAMPLE_APPLICATIONS);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [selectedInternship, usingSampleData]);

  // Get selected internship details
  const getSelectedInternshipDetails = () => {
    return internships.find(internship => internship.id === selectedInternship) || {};
  };

  // Filter applications based on search query
  const filteredApplications = applications.filter(application => {
    const fullName = application.full_name || '';
    const studentId = application.student_id || '';
    const department = application.department || '';
    const email = application.email || '';
    
    const query = searchQuery.toLowerCase();
    
    return fullName.toLowerCase().includes(query) || 
           studentId.toLowerCase().includes(query) || 
           department.toLowerCase().includes(query) ||
           email.toLowerCase().includes(query);
  });

  if (loading && internships.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress sx={{ color: '#f97316' }} />
      </Box>
    );
  }

  const selectedInternshipDetails = getSelectedInternshipDetails();

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
          Internship Applications
        </Typography>
      </Box>

      {usingSampleData && (
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(237, 108, 2, 0.15)',
            color: '#fb8c00',
            '& .MuiAlert-icon': {
              color: '#fb8c00'
            }
          }}
        >
          Using demo data. API connection could not be established.
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
            onChange={(e) => setSelectedInternship(e.target.value)}
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

      {selectedInternship && (
        <Paper sx={{
          p: 3,
          borderRadius: 2,
          background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
          mb: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                bgcolor: 'rgba(249, 115, 22, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}
            >
              <WorkIcon sx={{ color: '#f97316', fontSize: 28 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
                {selectedInternshipDetails.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {selectedInternshipDetails.company_name} - {selectedInternshipDetails.location}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ApartmentIcon sx={{ color: '#3b82f6', mr: 1 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {selectedInternshipDetails.location || "No location specified"}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ color: '#ec4899', mr: 1 }} />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Deadline: {new Date(selectedInternshipDetails.application_deadline).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

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
          >
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress sx={{ color: '#f97316' }} />
          </Box>
        )}

        {!loading && applications.length === 0 ? (
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
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Student</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Student ID</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Year</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Applied On</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Resume</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications.map((student, index) => {
                  // Find the application for this student for the selected internship
                  // Try to extract application details from student data
                  let applicationDetails = null;
                  
                  // Check if student has applications array
                  if (student.applications && Array.isArray(student.applications)) {
                    applicationDetails = student.applications.find(app => 
                      app.internship === selectedInternship || 
                      (app.internship && app.internship.id === selectedInternship)
                    );
                  }
                  
                  // For students returned directly from the internship applications endpoint
                  // the application details might be already attached to student object
                  const status = applicationDetails?.status || student.status || 'pending';
                  const appliedAt = applicationDetails?.applied_at || student.applied_at
                    ? new Date(applicationDetails?.applied_at || student.applied_at).toLocaleDateString() 
                    : 'Unknown';
                  
                  // Generate a consistent color from student ID
                  const colorHash = student.student_id?.split('').reduce(
                    (acc, char) => acc + char.charCodeAt(0), 0
                  ) % 360 || 0;
                  
                  const avatarColor = `hsl(${colorHash}, 70%, 50%)`;
                  const avatarText = student.full_name 
                    ? student.full_name.charAt(0).toUpperCase() 
                    : 'S';

                  // Ensure we have a resume URL (could be from different places in the data)
                  const resumeUrl = applicationDetails?.resume || student.resume;
                  
                  return (
                    <TableRow 
                      key={student.student_id || student.id || index}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.03)'
                        }
                      }}
                    >
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
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              mr: 1,
                              display: 'flex',
                              bgcolor: 'rgba(249, 115, 22, 0.15)',
                              color: '#f97316',
                              borderRadius: '50%',
                              width: 28,
                              height: 28,
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <PersonIcon fontSize="small" />
                          </Box>
                          {student.student_id}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {student.department || student.dept_of_study || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {student.year || 'N/A'}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {appliedAt}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={
                            status === 'shortlisted' ? 'Shortlisted' :
                            status === 'rejected' ? 'Rejected' : 
                            'Pending'
                          }
                          size="small"
                          sx={{
                            bgcolor: 
                              status === 'shortlisted' ? 'rgba(46, 125, 50, 0.2)' :
                              status === 'rejected' ? 'rgba(211, 47, 47, 0.2)' :
                              'rgba(237, 108, 2, 0.2)',
                            color: 
                              status === 'shortlisted' ? '#66bb6a' :
                              status === 'rejected' ? '#ef5350' :
                              '#fb8c00',
                            border: '1px solid',
                            borderColor: 
                              status === 'shortlisted' ? 'rgba(46, 125, 50, 0.5)' :
                              status === 'rejected' ? 'rgba(211, 47, 47, 0.5)' :
                              'rgba(237, 108, 2, 0.5)',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {resumeUrl ? (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<DescriptionIcon />}
                            href={resumeUrl}
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default ApplicationsList; 