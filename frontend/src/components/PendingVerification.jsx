import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress
} from '@mui/material';

const PendingVerification = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h4" gutterBottom>
            Profile Under Review
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your profile has been submitted and is currently under review by management.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You will be notified once your profile is approved. After approval, you will have access to the dashboard.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default PendingVerification; 