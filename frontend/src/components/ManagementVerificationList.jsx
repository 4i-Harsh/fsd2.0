import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';

const ManagementVerificationList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifications, setVerifications] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const fetchVerifications = async (isPending = false) => {
    try {
      const token = localStorage.getItem('token');
      const url = isPending 
        ? 'http://localhost:8000/api/managements/verifications/pending/'
        : 'http://localhost:8000/api/managements/verifications/';
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setVerifications(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch verifications. Please try again.');
      console.error('Error fetching verifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications(activeTab === 1);
  }, [activeTab]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getStatusChip = (status) => {
    const statusColors = {
      pending: 'warning',
      approved: 'success',
      rejected: 'error'
    };
    
    return (
      <Chip 
        label={status.charAt(0).toUpperCase() + status.slice(1)} 
        color={statusColors[status]} 
        size="small"
      />
    );
  };

  const handleViewProfile = (verificationId) => {
    navigate(`/management/dashboard/verifications/${verificationId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Teacher Profile Verifications
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="All Verifications" />
            <Tab label="Pending Verifications" />
          </Tabs>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Teacher Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Verification Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {verifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No verifications found
                  </TableCell>
                </TableRow>
              ) : (
                verifications.map((verification) => (
                  <TableRow key={verification.id}>
                    <TableCell>{verification.profile.full_name}</TableCell>
                    <TableCell>{verification.profile.email}</TableCell>
                    <TableCell>{verification.profile.department}</TableCell>
                    <TableCell>{getStatusChip(verification.status)}</TableCell>
                    <TableCell>
                      {verification.verification_date 
                        ? new Date(verification.verification_date).toLocaleDateString()
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleViewProfile(verification.id)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ManagementVerificationList; 