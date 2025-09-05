import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Grid, 
  Chip, 
  Button, 
  Tab, 
  Tabs, 
  CardMedia,
  CircularProgress,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  CalendarToday, 
  Payment, 
  LocalShipping,
  Star,
  LocationOn 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { bookingService, Booking } from '../services/bookingService';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => ({
  fontWeight: 600,
  ...(status === 'pending' && {
    backgroundColor: '#FFF3CD',
    color: '#856404',
  }),
  ...(status === 'confirmed' && {
    backgroundColor: '#D4EDDA',
    color: '#155724',
  }),
  ...(status === 'active' && {
    backgroundColor: '#CCE5FF',
    color: '#0052CC',
  }),
  ...(status === 'completed' && {
    backgroundColor: '#D1ECF1',
    color: '#0C5460',
  }),
  ...(status === 'cancelled' && {
    backgroundColor: '#F8D7DA',
    color: '#721C24',
  }),
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`booking-tabpanel-${index}`}
      aria-labelledby={`booking-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const BookingPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [renterBookings, setRenterBookings] = useState<Booking[]>([]);
  const [ownerBookings, setOwnerBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [renterResponse, ownerResponse] = await Promise.all([
        bookingService.getRenterBookings(),
        bookingService.getOwnerBookings()
      ]);

      if (renterResponse.success) {
        setRenterBookings(renterResponse.data);
      }

      if (ownerResponse.success) {
        setOwnerBookings(ownerResponse.data);
      }
    } catch (err) {
      setError('Failed to fetch bookings. Please try again.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      case 'active': return 'info';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus as any);
      fetchBookings(); // Refresh the data
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  };

  const renderBookingCard = (booking: Booking, isOwner: boolean = false) => (
    <StyledCard key={booking.id}>
      <Grid container>
        <Grid item xs={12} md={3}>
          <CardMedia
            component="img"
            height="200"
            image="https://via.placeholder.com/300x200?text=Item+Image"
            alt="Item"
            sx={{ borderRadius: '8px 0 0 8px' }}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h6" component="h3" gutterBottom>
                Booking #{booking.id.slice(-6)}
              </Typography>
              <StatusChip 
                label={booking.status.toUpperCase()} 
                status={booking.status}
                size="small"
              />
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Payment sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    Total: ₹{booking.totalAmount.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocalShipping sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {booking.pickupDetails?.method || 'Pickup'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Payment Status: <Chip 
                    label={booking.paymentStatus.toUpperCase()} 
                    size="small" 
                    color={booking.paymentStatus === 'paid' ? 'success' : 'warning'}
                  />
                </Typography>
                {isOwner && (
                  <Typography variant="body2" color="text.secondary">
                    {booking.status === 'pending' && (
                      <Box sx={{ mt: 1 }}>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="success"
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          sx={{ mr: 1 }}
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="error"
                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        >
                          Decline
                        </Button>
                      </Box>
                    )}
                  </Typography>
                )}
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Created: {formatDate(booking.createdAt)}
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => navigate(`/booking/${booking.id}`)}
              >
                View Details
              </Button>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </StyledCard>
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        My Bookings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="booking tabs">
          <Tab 
            label={`My Rentals (${renterBookings.length})`} 
            id="booking-tab-0"
            aria-controls="booking-tabpanel-0"
          />
          <Tab 
            label={`My Listings (${ownerBookings.length})`} 
            id="booking-tab-1"
            aria-controls="booking-tabpanel-1"
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renterBookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No rentals found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't rented any items yet.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/listings')}
            >
              Browse Items
            </Button>
          </Box>
        ) : (
          <Box>
            {renterBookings.map((booking) => renderBookingCard(booking, false))}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {ownerBookings.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No bookings for your items
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start listing items to receive booking requests.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/profile')}
            >
              List an Item
            </Button>
          </Box>
        ) : (
          <Box>
            {ownerBookings.map((booking) => renderBookingCard(booking, true))}
          </Box>
        )}
      </TabPanel>
    </Container>
  );
};

export default BookingPage;