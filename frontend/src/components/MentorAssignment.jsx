import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  alpha
} from '@mui/material';
import { Assignment as AssignmentIcon, Person as PersonIcon, School as SchoolIcon } from '@mui/icons-material';

const MentorAssignment = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [mentorAssignments, setMentorAssignments] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    teacher_id: '',
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch teachers
        let teachersData = [];
        try {
          const teachersResponse = await fetch('http://127.0.0.1:8000/api/managements/teachers/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (teachersResponse.ok) {
            teachersData = await teachersResponse.json();
            console.log('Teachers data:', teachersData);
          } else {
            console.error('Failed to fetch teachers from primary endpoint');
            // Try alternative endpoint if available
            const altTeachersResponse = await fetch('http://127.0.0.1:8000/api/teachers/', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (altTeachersResponse.ok) {
              teachersData = await altTeachersResponse.json();
              console.log('Teachers data from alt endpoint:', teachersData);
            } else {
              console.error('Failed to fetch teachers from alternative endpoint');
            }
          }
        } catch (err) {
          console.error('Error fetching teachers:', err);
        }
        
        setTeachers(teachersData);
        
        // Fetch students - try multiple endpoints
        let studentsData = [];
        try {
          // First try the management applications endpoint
          const studentsResponse = await fetch('http://127.0.0.1:8000/api/managements/applications/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (studentsResponse.ok) {
            studentsData = await studentsResponse.json();
            console.log('Students data from applications:', studentsData);
          } else {
            console.error('Failed to fetch students from applications endpoint');
            
            // Try direct students endpoint
            const directStudentsResponse = await fetch('http://127.0.0.1:8000/api/students/', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (directStudentsResponse.ok) {
              studentsData = await directStudentsResponse.json();
              console.log('Students data from direct endpoint:', studentsData);
            } else {
              console.error('Failed to fetch students from direct endpoint');
            }
          }
        } catch (err) {
          console.error('Error fetching students:', err);
        }
        
        setStudents(studentsData);
        
        // Fetch existing mentor assignments
        try {
          const assignmentsResponse = await fetch('http://127.0.0.1:8000/api/managements/mentor-assignments/list/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (assignmentsResponse.ok) {
            const assignmentsData = await assignmentsResponse.json();
            console.log('Assignments data:', assignmentsData);
            setMentorAssignments(assignmentsData);
          } else {
            console.error('Failed to fetch mentor assignments');
            setMentorAssignments([]);
          }
        } catch (err) {
          console.error('Error fetching mentor assignments:', err);
          setMentorAssignments([]);
        }
        
      } catch (err) {
        console.error('Error in data fetching process:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    console.log('Submitting form data:', formData);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://127.0.0.1:8000/api/managements/mentor-assignments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      // Get the response text regardless of success or failure
      const responseText = await response.text();
      console.log('API Response:', response.status, responseText);
      
      // Try to parse as JSON if possible
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response as JSON:', e);
      }
      
      if (!response.ok) {
        // If we have parsed JSON with error details, use it
        if (data && (data.detail || data.error)) {
          throw new Error(data.detail || data.error || 'Failed to assign mentor');
        } else if (data) {
          // Try to extract error messages from any fields
          const errorMessages = [];
          Object.entries(data).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              errorMessages.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              errorMessages.push(`${field}: ${errors}`);
            }
          });
          
          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join('\n'));
          }
        }
        throw new Error(`Failed to assign mentor: ${response.status} ${responseText}`);
      }
      
      // If we have a valid JSON response, use it
      const result = data || {};
      
      // Update the mentor assignments list
      setMentorAssignments(prev => [result, ...prev]);
      
      // Reset form
      setFormData({
        student_id: '',
        teacher_id: '',
        notes: ''
      });
      
      setSuccess('Mentor assigned successfully!');
      
      // Refresh the assignments list
      try {
        const refreshResponse = await fetch('http://127.0.0.1:8000/api/managements/mentor-assignments/list/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          console.log('Refreshed assignments data:', refreshData);
          setMentorAssignments(refreshData);
        }
      } catch (refreshErr) {
        console.error('Error refreshing assignments:', refreshErr);
        // We don't surface this error to the user since the assignment was successful
      }
      
    } catch (err) {
      console.error('Error assigning mentor:', err);
      setError(err.message || 'An error occurred while assigning mentor');
    }
  };

  if (loading) {
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
          Mentor Assignments
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Paper 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              p: 3, 
              mb: 4,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle at 10% 10%, ${alpha('#f97316', 0.1)}, transparent 80%)`,
                zIndex: 0
              }
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3, 
                color: 'white',
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                zIndex: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -8,
                  height: 3,
                  width: '70%',
                  background: 'linear-gradient(90deg, #f97316 0%, rgba(249, 115, 22, 0) 100%)',
                  borderRadius: 2
                }
              }}
            >
              Assign New Mentor
            </Typography>

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

            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(46, 125, 50, 0.15)',
                  color: '#b9f6ca',
                  '& .MuiAlert-icon': {
                    color: '#b9f6ca'
                  }
                }}
              >
                {success}
              </Alert>
            )}

            <FormControl 
              fullWidth 
              variant="outlined" 
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
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#f97316',
                  },
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            >
              <InputLabel id="student-select-label">Select Student</InputLabel>
              <Select
                labelId="student-select-label"
                id="student-select"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                label="Select Student"
                required
              >
                {students && students.length > 0 ? (
                  students.map((student) => {
                    // Handle different possible data formats
                    const studentId = student.student_id || student.id;
                    const username = student.user && student.user.username ? student.user.username : '';
                    const fullName = student.full_name || 'Student';
                    const email = student.email || (student.user && student.user.email) || '';
                    
                    // Display format: Username (Full Name) - ID
                    const displayText = username ? 
                      `${username} (${fullName}) - ${studentId}` : 
                      `${fullName} - ${studentId}`;
                    
                    return (
                      <MenuItem key={studentId} value={studentId}>
                        {displayText}
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem disabled value="">
                    No students available
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <FormControl 
              fullWidth 
              variant="outlined" 
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
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#f97316',
                  },
                },
                '& .MuiSelect-icon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                }
              }}
            >
              <InputLabel id="teacher-select-label">Select Teacher</InputLabel>
              <Select
                labelId="teacher-select-label"
                id="teacher-select"
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
                label="Select Teacher"
                required
              >
                {teachers && teachers.length > 0 ? (
                  teachers.map((teacher) => {
                    // Handle different possible data formats
                    const teacherId = teacher.id;
                    const username = teacher.user && teacher.user.username ? teacher.user.username : '';
                    const fullName = teacher.full_name || 'Faculty Member';
                    const department = teacher.department || '';
                    
                    // Display format: Faculty Member(username) - Department
                    const displayText = username ? 
                      `Faculty Member(${username})${department ? ` - ${department}` : ''}` : 
                      `Faculty Member${department ? ` - ${department}` : ''}`;
                    
                    return (
                      <MenuItem key={teacherId} value={teacherId}>
                        {displayText}
                      </MenuItem>
                    );
                  })
                ) : (
                  <MenuItem disabled value="">
                    No teachers available
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={4}
              name="notes"
              label="Notes (Optional)"
              value={formData.notes}
              onChange={handleChange}
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
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: '#f97316',
                  },
                }
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<AssignmentIcon />}
              sx={{
                bgcolor: '#f97316',
                color: 'white',
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 'bold',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#ea580c',
                  boxShadow: '0 6px 20px rgba(249, 115, 22, 0.4)'
                }
              }}
            >
              Assign Mentor
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={7}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(145deg, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.9) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                color: 'white',
                fontWeight: 'bold',
                position: 'relative',
                display: 'inline-block',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -8,
                  height: 3,
                  width: '70%',
                  background: 'linear-gradient(90deg, #f97316 0%, rgba(249, 115, 22, 0) 100%)',
                  borderRadius: 2
                }
              }}
            >
              Recent Assignments
            </Typography>

            {mentorAssignments.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                <Typography>No mentor assignments found.</Typography>
              </Box>
            ) : (
              <TableContainer 
                sx={{ 
                  mt: 2,
                  '& .MuiTableCell-root': {
                    borderColor: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Student</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Teacher</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Assigned On</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mentorAssignments.map((assignment) => {
                      const date = new Date(assignment.assigned_at);
                      const formattedDate = date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                      
                      // Get student and teacher details safely
                      const studentDetails = assignment.student_details || {};
                      const teacherDetails = assignment.teacher_details || {};
                      
                      // Get usernames and full names
                      const studentUsername = 
                        (studentDetails.user && studentDetails.user.username) || 
                        (studentDetails.username) || '';
                      const teacherUsername = 
                        (teacherDetails.user && teacherDetails.user.username) || 
                        (teacherDetails.username) || '';
                      const studentName = studentDetails.full_name || 'Student';
                      const teacherName = teacherDetails.full_name || 'Faculty Member';
                      
                      // Teacher display format: Faculty Member(username)
                      const teacherDisplayName = teacherUsername ? 
                        `Faculty Member(${teacherUsername})` : 'Faculty Member';

                      return (
                        <TableRow 
                          key={assignment.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(255,255,255,0.03)'
                            }
                          }}
                        >
                          <TableCell sx={{ color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box 
                                sx={{ 
                                  mr: 1, 
                                  display: 'flex',
                                  bgcolor: 'rgba(59, 130, 246, 0.2)',
                                  color: '#3b82f6',
                                  borderRadius: '50%',
                                  width: 32,
                                  height: 32,
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <PersonIcon fontSize="small" />
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {studentUsername ? studentUsername : studentName}
                                </Typography>
                                {studentUsername && (
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    {studentName}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Box 
                                sx={{ 
                                  mr: 1, 
                                  display: 'flex',
                                  bgcolor: 'rgba(249, 115, 22, 0.2)',
                                  color: '#f97316',
                                  borderRadius: '50%',
                                  width: 32,
                                  height: 32,
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <SchoolIcon fontSize="small" />
                              </Box>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {teacherUsername ? `Faculty Member(${teacherUsername})` : 'Faculty Member'}
                                </Typography>
                                {teacherUsername && teacherName !== 'Faculty Member' && (
                                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                    {teacherName}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: 'white' }}>
                            {formattedDate}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MentorAssignment; 