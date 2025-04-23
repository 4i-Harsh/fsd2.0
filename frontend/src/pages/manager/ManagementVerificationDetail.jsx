import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

const ManagementVerificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verification, setVerification] = useState(null);
  const [comments, setComments] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const fetchVerification = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/managements/verifications/${id}/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setVerification(response.data);
      setComments(response.data.comments || '');
      setError('');
    } catch (err) {
      setError('Failed to fetch verification details. Please try again.');
      console.error('Error fetching verification:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerification();
  }, [id]);

  const handleAction = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `http://localhost:8000/api/managements/verifications/${id}/`,
        {
          status,
          comments
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Refresh verification data
      await fetchVerification();
      setDialogOpen(false);
      setActionType(null);
    } catch (err) {
      setError('Failed to update verification status. Please try again.');
      console.error('Error updating verification:', err);
    }
  };

  const openDialog = (action) => {
    setActionType(action);
    setDialogOpen(true);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!verification) {
    return (
      <Container maxWidth="md">
        <Alert severity="error">Verification not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/management/dashboard/verifications')}
          sx={{ mb: 2 }}
        >
          Back to Verifications
        </Button>

        <Typography variant="h4" gutterBottom>
          Teacher Profile Verification
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Status: {getStatusChip(verification.status)}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Full Name</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {verification.profile.full_name}
              </Typography>

              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {verification.profile.email}
              </Typography>

              <Typography variant="subtitle2">Department</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {verification.profile.department}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Designation</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {verification.profile.designation}
              </Typography>

              <Typography variant="subtitle2">Years of Experience</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {verification.profile.years_of_experience}
              </Typography>

              <Typography variant="subtitle2">LinkedIn Profile</Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {verification.profile.linkedin_profile ? (
                  <Link 
                    href={verification.profile.linkedin_profile} 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Profile
                  </Link>
                ) : (
                  'Not provided'
                )}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2">Resume</Typography>
              <Button
                variant="outlined"
                size="small"
                href={verification.profile.resume}
                target="_blank"
                sx={{ mt: 1 }}
              >
                Download Resume
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Comments
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                disabled={verification.status !== 'pending'}
              />
            </Grid>

            {verification.status === 'pending' && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => openDialog('approve')}
                  >
                    Approve Profile
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => openDialog('reject')}
                  >
                    Reject Profile
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>

        {verification.verification_date && (
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date(verification.verification_date).toLocaleString()}
            {verification.verified_by && ` by ${verification.verified_by}`}
          </Typography>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {actionType === 'approve' ? 'Approve Profile' : 'Reject Profile'}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {actionType} this teacher's profile?
            {actionType === 'reject' && ' Please provide a reason in the comments.'}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => handleAction(actionType === 'approve' ? 'approved' : 'rejected')}
            color={actionType === 'approve' ? 'success' : 'error'}
            variant="contained"
          >
            Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManagementVerificationDetail; 