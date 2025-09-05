import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ListingPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Browse All Listings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coming soon - Browse through thousands of available items
        </Typography>
      </Box>
    </Container>
  );
};

export default ListingPage;