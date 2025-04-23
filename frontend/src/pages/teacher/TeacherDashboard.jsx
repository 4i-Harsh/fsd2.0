import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teacherData, setTeacherData] = useState(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:8000/api/teachers/profile/',
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        setTeacherData(response.data);
      } catch (err) {
        setError('Failed to load teacher data');
        console.error('Error fetching teacher data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/teacher/login');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3} justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" component="h1" gutterBottom>
              Teacher Dashboard
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {teacherData && (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile Information
                  </Typography>
                  <Typography variant="body1">
                    <strong>Name:</strong> {teacherData.full_name}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Department:</strong> {teacherData.department}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Designation:</strong> {teacherData.designation}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {teacherData.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Experience:</strong> {teacherData.years_of_experience} years
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Edit Profile
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            {/* Placeholder for future features */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Quick Actions
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    More features coming soon...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default TeacherDashboard; 