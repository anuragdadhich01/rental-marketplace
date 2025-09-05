import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ProfilePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          User Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coming soon - User profile management and settings
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;