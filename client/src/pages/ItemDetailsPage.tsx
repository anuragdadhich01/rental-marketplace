import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const ItemDetailsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
          Item Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coming soon - Detailed item view with booking functionality
        </Typography>
      </Box>
    </Container>
  );
};

export default ItemDetailsPage;