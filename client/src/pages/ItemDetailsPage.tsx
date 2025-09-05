import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Divider,
  Avatar,
  Rating,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  Star,
  LocationOn,
  Verified,
  Security,
  CalendarToday,
  LocalShipping,
  Policy,
  Person,
  Phone,
  Email,
  Share,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { itemService, Item } from '../services/itemService';

const ImageContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  marginBottom: theme.spacing(2)
}));

const PriceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  position: 'sticky',
  top: theme.spacing(2)
}));

const SpecificationCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '8px',
  backgroundColor: theme.palette.grey[50],
  marginBottom: theme.spacing(2)
}));

const UserCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: '12px',
  marginBottom: theme.spacing(2)
}));

const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [item, setItem] = useState<Item | null>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await itemService.getItemById(id);
        
        if (response.success) {
          setItem(response.data.item);
          setOwner(response.data.owner);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        setError('Failed to load item details. Please try again.');
        console.error('Error fetching item details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  const handleBookingSubmit = () => {
    // TODO: Implement actual booking logic
    alert('Booking functionality will be implemented soon!');
    setBookingDialogOpen(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title,
        text: item?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const totalCost = item ? calculateDays() * item.pricing.daily : 0;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !item) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Item not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/listings')}>
          Back to Listings
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Images and Details */}
        <Grid item xs={12} md={8}>
          {/* Header with title and actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                {item.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Star sx={{ color: '#FFD700', fontSize: '1.2rem', mr: 0.5 }} />
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    {item.ratings.average}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({item.ratings.count} reviews)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ fontSize: '1.2rem', mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {item.location.city}, {item.location.state}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                onClick={() => setIsFavorite(!isFavorite)}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<Share />}
                onClick={handleShare}
              >
                Share
              </Button>
            </Box>
          </Box>

          {/* Image Gallery */}
          <ImageContainer>
            <CardMedia
              component="img"
              height="400"
              image={item.images[selectedImageIndex]}
              alt={item.title}
              sx={{ objectFit: 'cover' }}
            />
            {item.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                {item.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    sx={{
                      width: 80,
                      height: 60,
                      borderRadius: 1,
                      overflow: 'hidden',
                      border: selectedImageIndex === index ? 2 : 1,
                      borderColor: selectedImageIndex === index ? 'primary.main' : 'grey.300',
                      cursor: 'pointer'
                    }}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </ImageContainer>

          {/* Description */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {item.description}
            </Typography>
          </Box>

          {/* Specifications */}
          {item.specifications && Object.keys(item.specifications).length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Specifications
              </Typography>
              <SpecificationCard>
                <Grid container spacing={2}>
                  {Object.entries(item.specifications).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </SpecificationCard>
            </Box>
          )}

          {/* Policies */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Rental Policies
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LocalShipping />
                </ListItemIcon>
                <ListItemText
                  primary="Pickup/Delivery"
                  secondary={item.policies.pickupDelivery === 'both' ? 'Both pickup and delivery available' : 
                           item.policies.pickupDelivery === 'pickup' ? 'Pickup only' : 'Delivery only'}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Policy />
                </ListItemIcon>
                <ListItemText
                  primary="Cancellation Policy"
                  secondary={`${item.policies.cancellationPolicy.charAt(0).toUpperCase()}${item.policies.cancellationPolicy.slice(1)} cancellation`}
                />
              </ListItem>
              {item.policies.additionalRules && (
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText
                    primary="Additional Rules"
                    secondary={item.policies.additionalRules}
                  />
                </ListItem>
              )}
            </List>
          </Box>

          {/* Owner Information */}
          {owner && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Meet Your Host
              </Typography>
              <UserCard>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={owner.avatar}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  >
                    {owner.firstName?.[0]}{owner.lastName?.[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {owner.firstName} {owner.lastName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={owner.trustScore || 4.5} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        {owner.totalRentals || 0} rentals
                      </Typography>
                      {owner.isVerified && (
                        <Verified sx={{ fontSize: '1rem', color: 'primary.main' }} />
                      )}
                    </Box>
                  </Box>
                </Box>
                {owner.bio && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {owner.bio}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" startIcon={<Person />}>
                    View Profile
                  </Button>
                  <Button variant="outlined" size="small" startIcon={<Email />}>
                    Contact
                  </Button>
                </Box>
              </UserCard>
            </Box>
          )}
        </Grid>

        {/* Right Column - Booking Card */}
        <Grid item xs={12} md={4}>
          <PriceCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                ₹{item.pricing.daily}
                <Typography component="span" variant="body1" color="text.secondary">
                  /day
                </Typography>
              </Typography>
              <Chip 
                label={item.condition.charAt(0).toUpperCase() + item.condition.slice(1)} 
                color="primary" 
                variant="outlined"
              />
            </Box>

            {item.pricing.weekly && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Weekly: ₹{item.pricing.weekly}
              </Typography>
            )}
            {item.pricing.monthly && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Monthly: ₹{item.pricing.monthly}
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {startDate && endDate && calculateDays() > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    ₹{item.pricing.daily} × {calculateDays()} days
                  </Typography>
                  <Typography variant="body2">
                    ₹{totalCost}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Security Deposit
                  </Typography>
                  <Typography variant="body2">
                    ₹{item.pricing.securityDeposit}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    ₹{totalCost + item.pricing.securityDeposit}
                  </Typography>
                </Box>
              </Box>
            )}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => setBookingDialogOpen(true)}
              disabled={!startDate || !endDate || calculateDays() <= 0}
              sx={{ mb: 2 }}
            >
              Book Now
            </Button>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
              You won't be charged yet
            </Typography>
          </PriceCard>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Your Booking</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            You're about to book "{item.title}" for {calculateDays()} days.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Rental Cost:</Typography>
            <Typography>₹{totalCost}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>Security Deposit:</Typography>
            <Typography>₹{item.pricing.securityDeposit}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">₹{totalCost + item.pricing.securityDeposit}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBookingSubmit}>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ItemDetailsPage;