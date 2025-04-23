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
  alpha,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  WorkOutline as ExperienceIcon
} from '@mui/icons-material';

const TeachersList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        console.log('Starting to fetch teacher data...');
        
        // Try a more direct approach to fetch teachers with their profiles
        try {
          // First try a specialized endpoint that might return teacher profiles directly
          const fullTeachersResponse = await fetch('http://127.0.0.1:8000/api/teachers/with-profiles/', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (fullTeachersResponse.ok) {
            const fullTeachersData = await fullTeachersResponse.json();
            console.log('📊 Teachers with profiles from specialized endpoint:', fullTeachersData);
            setTeachers(fullTeachersData);
          } else {
            console.log('Specialized endpoint not available. Trying separate fetches...');
            
            // Fetch basic teachers data first
            const teachersResponse = await fetch('http://127.0.0.1:8000/api/managements/teachers/', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (!teachersResponse.ok) {
              // Try alternative teachers endpoint
              const altTeachersResponse = await fetch('http://127.0.0.1:8000/api/teachers/', {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (!altTeachersResponse.ok) {
                throw new Error('Failed to fetch basic teacher data');
              }
              
              const basicTeachers = await altTeachersResponse.json();
              console.log('📊 Basic teachers from alternative endpoint:', basicTeachers);
              await fetchAndMergeProfiles(basicTeachers, token);
            } else {
              const basicTeachers = await teachersResponse.json();
              console.log('📊 Basic teachers data:', basicTeachers);
              console.table(basicTeachers.map(t => ({
                id: t.id,
                username: t.username || (t.user && t.user.username) || 'N/A'
              })));
              
              await fetchAndMergeProfiles(basicTeachers, token);
            }
          }
        } catch (error) {
          console.error('Error in main teacher fetch process:', error);
          setError('Failed to load teachers. Please try again.');
        }
      } catch (err) {
        console.error('Error in overall fetch process:', err);
        setError('Failed to load teachers. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    // Helper function to fetch and merge teacher profiles
    const fetchAndMergeProfiles = async (basicTeachers, token) => {
      try {
        // First try to get all profiles in one request
        const profilesResponse = await fetch('http://127.0.0.1:8000/api/teachers/profiles/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (profilesResponse.ok) {
          const profiles = await profilesResponse.json();
          console.log('📊 All teacher profiles:', profiles);
          
          // Map profiles to teachers
          const teachersWithProfiles = basicTeachers.map(teacher => {
            // Try to find matching profile using teacher.id to match profile.teacher.id or profile.teacher
            const matchingProfile = profiles.find(profile => 
              (profile.teacher && profile.teacher.id === teacher.id) ||
              (profile.teacher === teacher.id)
            );
            
            return {
              ...teacher,
              profile: matchingProfile || {}
            };
          });
          
          console.log('📊 Teachers with mapped bulk profiles:', teachersWithProfiles);
          setTeachers(teachersWithProfiles);
        } else {
          // If bulk fetch fails, try individual profile fetches
          console.log('Bulk profile fetch failed, trying individual fetches...');
          
          // Add a small delay between requests to avoid overwhelming the server
          const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
          
          const teachersWithProfiles = await Promise.all(
            basicTeachers.map(async (teacher, index) => {
              try {
                // Add a small delay between requests
                if (index > 0) await delay(100);
                
                // Try different possible endpoints for getting a teacher's profile
                const endpoints = [
                  `http://127.0.0.1:8000/api/teachers/${teacher.id}/profile/`,
                  `http://127.0.0.1:8000/api/teachers/profile/${teacher.id}/`,
                  // If the teacher has a user field with username
                  teacher.user && teacher.user.username ? 
                    `http://127.0.0.1:8000/api/teachers/profile/by-username/${teacher.user.username}/` : null,
                  // If teacher has a username directly
                  teacher.username ? 
                    `http://127.0.0.1:8000/api/teachers/profile/by-username/${teacher.username}/` : null
                ].filter(Boolean); // Remove null endpoints
                
                // Try each endpoint until one works
                for (const endpoint of endpoints) {
                  try {
                    const profileResponse = await fetch(endpoint, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
                    
                    if (profileResponse.ok) {
                      const profile = await profileResponse.json();
                      console.log(`📊 Found profile for teacher ${teacher.id || teacher.username} at ${endpoint}:`, profile);
                      return {
                        ...teacher,
                        profile
                      };
                    }
                  } catch (err) {
                    console.log(`Endpoint ${endpoint} failed:`, err.message);
                    // Continue to the next endpoint
                  }
                }
                
                // Direct database query for teacher4 (special case handling)
                const username = teacher.username || (teacher.user && teacher.user.username);
                if (username === 'teacher4') {
                  console.log('🔍 Attempting to fetch profile for teacher4 specifically...');
                  try {
                    const teacher4Response = await fetch('http://127.0.0.1:8000/api/teachers/profile/teacher4/', {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
                    
                    if (teacher4Response.ok) {
                      const profile = await teacher4Response.json();
                      console.log('📊 Found profile for teacher4:', profile);
                      return {
                        ...teacher,
                        profile
                      };
                    }
                  } catch (err) {
                    console.log('Teacher4 special endpoint failed:', err.message);
                  }
                }
                
                console.log(`⚠️ No profile found for teacher ${teacher.id || username}`);
                return teacher; // Return the teacher without a profile
              } catch (err) {
                console.error(`Error fetching profile for teacher ${teacher.id}:`, err);
                return teacher; // Return the teacher without a profile on error
              }
            })
          );
          
          console.log('📊 Teachers with individually fetched profiles:', teachersWithProfiles);
          setTeachers(teachersWithProfiles);
        }
        
        // Log the final state of teacher data with detailed breakdown
        console.log('🔍 FINAL TEACHER DATA BREAKDOWN:');
        const finalTeachers = teachers.length > 0 ? teachers : basicTeachers;
        finalTeachers.forEach((teacher, index) => {
          console.group(`Teacher ${index + 1}: ${teacher.username || (teacher.user && teacher.user.username) || 'Unknown'}`);
          console.log('Basic Data:', {
            id: teacher.id,
            username: teacher.username || (teacher.user && teacher.user.username) || 'N/A',
            email: teacher.email || (teacher.user && teacher.user.email) || 'N/A',
          });
          
          // Check if profile exists
          const profile = teacher.profile || {};
          if (Object.keys(profile).length > 0) {
            console.log('Profile Data:', {
              id: profile.id,
              full_name: profile.full_name || 'N/A',
              department: profile.department || 'N/A',
              designation: profile.designation || 'N/A',
              years_of_experience: profile.years_of_experience || 'N/A',
              linkedin_profile: profile.linkedin_profile || 'N/A',
              has_photo: !!profile.photo,
              has_resume: !!profile.resume,
              created_at: profile.created_at || 'N/A',
              updated_at: profile.updated_at || 'N/A'
            });
          } else {
            console.log('Profile Data: None');
          }
          
          // Check if verification info exists
          const verification = 
            (profile.verification) || 
            (teacher.profile_status && {
              has_profile: teacher.profile_status.has_profile,
              status: teacher.profile_status.verification_status
            });
          
          if (verification) {
            console.log('Verification Data:', verification);
          } else {
            console.log('Verification Data: None');
          }
          console.groupEnd();
        });
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setTeachers(basicTeachers || []);
      }
    };
    
    fetchTeachers();
  }, []);

  // Filter teachers based on search query
  const filteredTeachers = teachers.filter(teacher => {
    // Get all possible searchable fields
    const username = teacher.username || (teacher.user && teacher.user.username) || '';
    const email = teacher.email || (teacher.user && teacher.user.email) || 
                 (teacher.profile && teacher.profile.email) || '';
    
    // Get profile data
    const profile = teacher.profile || {};
    const fullName = profile.full_name || teacher.full_name || '';
    const department = profile.department || teacher.department || '';
    const designation = profile.designation || teacher.designation || '';
    
    const query = searchQuery.toLowerCase();
    
    return username.toLowerCase().includes(query) || 
           email.toLowerCase().includes(query) || 
           fullName.toLowerCase().includes(query) || 
           department.toLowerCase().includes(query) ||
           designation.toLowerCase().includes(query);
  });

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
          Teachers
        </Typography>
      </Box>

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
          placeholder="Search teachers by username, name, email, department or designation"
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

        {filteredTeachers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, color: 'rgba(255,255,255,0.6)' }}>
            <SchoolIcon sx={{ fontSize: 48, opacity: 0.6, mb: 2 }} />
            <Typography>
              {searchQuery ? 'No teachers match your search criteria' : 'No teachers found in the system'}
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
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Teacher</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Username</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Department</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Designation</TableCell>
                  <TableCell sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 'bold' }}>Experience</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeachers.map((teacher) => {
                  // Extract teacher details, handling potential missing data
                  const { id } = teacher;
                  
                  // Handle different data structures (direct or nested)
                  const username = teacher.username || (teacher.user && teacher.user.username) || 'N/A';
                  
                  // Try to get profile data - more thorough approach for extracting profile data
                  let profile = {};
                  if (teacher.profile && Object.keys(teacher.profile).length > 0) {
                    profile = teacher.profile;
                  } else if (teacher.teacher_profile) {
                    profile = teacher.teacher_profile;
                  } else if (typeof teacher.get_profile === 'function') {
                    profile = teacher.get_profile();
                  }
                  
                  const email = profile.email || teacher.email || (teacher.user && teacher.user.email) || 'N/A';
                  const fullName = profile.full_name || teacher.full_name || 'Faculty Member';
                  const department = profile.department || teacher.department || 'N/A';
                  const designation = profile.designation || teacher.designation || 'N/A';
                  const experience = profile.years_of_experience !== undefined ? 
                    `${profile.years_of_experience} years` : 'N/A';
                  const photo = profile.photo || teacher.photo || null;
                  
                  // For profile photo - use first letter of name or username
                  const avatarText = username.charAt(0).toUpperCase();
                  
                  // Generate a consistent color from username (for avatar)
                  const colorHash = username.split('').reduce(
                    (acc, char) => acc + char.charCodeAt(0), 0
                  ) % 360;
                  
                  const avatarColor = `hsl(${colorHash}, 70%, 50%)`;
                  
                  // Check verification status if available
                  const hasProfile = 
                    teacher.profile_status?.has_profile || 
                    !!profile.id || 
                    Object.keys(profile).length > 0;
                    
                  const verificationStatus = 
                    teacher.profile_status?.verification_status || 
                    (profile.verification && profile.verification.status) || 
                    'pending';
                  
                  return (
                    <TableRow 
                      key={id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.03)'
                        }
                      }}
                    >
                      <TableCell sx={{ color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar
                            src={photo} // Use photo if available
                            sx={{ 
                              bgcolor: avatarColor,
                              mr: 2
                            }}
                          >
                            {avatarText}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {`Faculty Member(${username})`}
                            </Typography>
                            {fullName !== 'Faculty Member' && (
                              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                {fullName}
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
                          {username}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              mr: 1,
                              display: 'flex',
                              bgcolor: 'rgba(59, 130, 246, 0.15)',
                              color: '#3b82f6',
                              borderRadius: '50%',
                              width: 28,
                              height: 28,
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <BusinessIcon fontSize="small" />
                          </Box>
                          {department}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        {designation}
                      </TableCell>
                      <TableCell sx={{ color: 'white' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              mr: 1,
                              display: 'flex',
                              bgcolor: 'rgba(236, 72, 153, 0.15)',
                              color: '#ec4899',
                              borderRadius: '50%',
                              width: 28,
                              height: 28,
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <ExperienceIcon fontSize="small" />
                          </Box>
                          {experience}
                        </Box>
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

export default TeachersList; 