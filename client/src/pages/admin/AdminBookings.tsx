import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import AdminSidebar from '../../components/admin/AdminSidebar';

const AdminBookings: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { xs: 0, md: '280px' } }}>
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Booking Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor and manage all booking transactions
            </Typography>
          </Box>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ textAlign: 'center', py: 4 }}>
                Booking management interface coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminBookings;