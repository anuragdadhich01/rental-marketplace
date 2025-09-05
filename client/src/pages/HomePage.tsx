import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Paper,
  InputBase,
  IconButton,
} from '@mui/material';
import { Search as SearchIcon, Star } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { itemService, Item } from '../services/itemService';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 50%, #FF9500 100%)',
  minHeight: '600px',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.2)',
    zIndex: 1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-20%',
    width: '100%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
    transform: 'rotate(15deg)',
    zIndex: 0,
  },
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  maxWidth: 700,
  margin: '0 auto',
  borderRadius: '24px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '220px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '20px',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(255,149,0,0.1) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: 1,
  },
  '&:hover::before': {
    opacity: 1,
  },
}));

const FeaturedItemCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  borderRadius: '20px',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
  },
  '& .MuiCardMedia-root': {
    transition: 'transform 0.3s ease',
  },
  '&:hover .MuiCardMedia-root': {
    transform: 'scale(1.05)',
  },
}));

// Mock data
const categories = [
  { id: 1, name: 'Furniture', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', count: '1,200+ items' },
  { id: 2, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', count: '850+ items' },
  { id: 3, name: 'Tools', image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400', count: '600+ items' },
  { id: 4, name: 'Sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', count: '400+ items' },
  { id: 5, name: 'Books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', count: '300+ items' },
  { id: 6, name: 'Musical', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', count: '250+ items' },
];

// Mock data for fallback
const mockFeaturedItems: Item[] = [
  {
    id: '1',
    ownerId: 'mock-owner-1',
    title: 'MacBook Pro 16" 2023',
    description: 'High-performance laptop perfect for work or creative projects',
    category: 'electronics',
    subCategory: 'laptop',
    condition: 'like-new',
    pricing: { daily: 2500, securityDeposit: 50000 },
    ratings: { average: 4.9, count: 127 },
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
    location: { city: 'Mumbai', state: 'Maharashtra', coordinates: { lat: 19.0760, lng: 72.8777 } },
    availability: { available: true, calendar: [] },
    policies: { pickupDelivery: 'pickup', cancellationPolicy: 'flexible' },
    specifications: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  } as Item,
  {
    id: '2', 
    ownerId: 'mock-owner-2',
    title: 'Canon EOS R5 Camera',
    description: 'Professional camera for photography and videography',
    category: 'electronics',
    subCategory: 'camera',
    condition: 'like-new',
    pricing: { daily: 3000, securityDeposit: 60000 },
    ratings: { average: 4.8, count: 89 },
    images: ['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400'],
    location: { city: 'Delhi', state: 'NCR', coordinates: { lat: 28.6139, lng: 77.2090 } },
    availability: { available: true, calendar: [] },
    policies: { pickupDelivery: 'pickup', cancellationPolicy: 'flexible' },
    specifications: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  } as Item,
  {
    id: '3',
    ownerId: 'mock-owner-3',
    title: 'Herman Miller Ergonomic Chair',
    description: 'Premium ergonomic office chair for comfortable work',
    category: 'furniture',
    subCategory: 'chair',
    condition: 'good',
    pricing: { daily: 800, securityDeposit: 15000 },
    ratings: { average: 4.7, count: 156 },
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'],
    location: { city: 'Bangalore', state: 'Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 } },
    availability: { available: true, calendar: [] },
    policies: { pickupDelivery: 'pickup', cancellationPolicy: 'flexible' },
    specifications: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  } as Item,
  {
    id: '4',
    ownerId: 'mock-owner-4',
    title: 'DJI Mavic Air 2 Drone',
    description: 'Professional drone for aerial photography and videography',
    category: 'electronics',
    subCategory: 'drone',
    condition: 'like-new',
    pricing: { daily: 1800, securityDeposit: 30000 },
    ratings: { average: 4.9, count: 93 },
    images: ['https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400'],
    location: { city: 'Pune', state: 'Maharashtra', coordinates: { lat: 18.5204, lng: 73.8567 } },
    availability: { available: true, calendar: [] },
    policies: { pickupDelivery: 'pickup', cancellationPolicy: 'flexible' },
    specifications: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  } as Item,
];

const featuredItems = [
  {
    id: 1,
    name: 'MacBook Pro 16" 2023',
    price: '₹2,500/day',
    rating: 4.9,
    reviews: 127,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    location: 'Mumbai, Maharashtra'
  },
  {
    id: 2,
    name: 'Canon EOS R5 Camera',
    price: '₹3,000/day',
    rating: 4.8,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
    location: 'Delhi, NCR'
  },
  {
    id: 3,
    name: 'Herman Miller Ergonomic Chair',
    price: '₹800/day',
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    location: 'Bangalore, Karnataka'
  },
  {
    id: 4,
    name: 'DJI Mavic Air 2 Drone',
    price: '₹1,800/day',
    rating: 4.9,
    reviews: 93,
    image: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400',
    location: 'Pune, Maharashtra'
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredItemsData, setFeaturedItemsData] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedItems = async () => {
      try {
        const response = await itemService.getFeaturedItems();
        if (response.success) {
          setFeaturedItemsData(response.data);
        }
      } catch (error) {
        console.error('Failed to load featured items:', error);
        // Use fallback mock data if API fails
        setFeaturedItemsData(mockFeaturedItems);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedItems();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h1" 
              sx={{ 
                fontWeight: 800, 
                mb: 3,
                fontSize: { xs: '2.5rem', md: '4rem', lg: '4.5rem' },
                background: 'linear-gradient(135deg, #FFFFFF 0%, #E5E5EA 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              }}
            >
              Rent anything,<br />anywhere
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 5, 
                opacity: 0.95,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 400,
                maxWidth: 600,
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              From premium electronics to designer furniture, discover thousands of items 
              from trusted people in your community
            </Typography>
            
            {/* Search Bar */}
            <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
              <SearchBar>
                <InputBase
                  sx={{ 
                    ml: 3, 
                    flex: 1, 
                    fontSize: '1.1rem',
                    '& input::placeholder': {
                      color: '#8E8E93',
                      opacity: 1,
                    }
                  }}
                  placeholder="What would you like to rent today?"
                  inputProps={{ 'aria-label': 'search items' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton 
                  type="submit" 
                  sx={{ 
                    p: '12px', 
                    bgcolor: '#007AFF',
                    color: 'white',
                    mr: 1,
                    '&:hover': {
                      bgcolor: '#0056CC',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease',
                  }} 
                  aria-label="search"
                >
                  <SearchIcon />
                </IconButton>
              </SearchBar>
            </Box>

            {/* Quick Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              {[
                { number: '10,000+', label: 'Items Available' },
                { number: '5,000+', label: 'Happy Customers' },
                { number: '25+', label: 'Cities' },
              ].map((stat, index) => (
                <Box key={index} sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {stat.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Browse by Category */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Browse by Category
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Discover items across popular categories
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <CategoryCard>
                  <CardMedia
                    component="img"
                    height="160"
                    image={category.image}
                    alt={category.name}
                    sx={{ 
                      objectFit: 'cover',
                      filter: 'brightness(0.9)',
                    }}
                  />
                  <CardContent sx={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                    color: 'white',
                    zIndex: 2,
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {category.count}
                    </Typography>
                  </CardContent>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Items */}
        <Box sx={{ mb: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Featured Items
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
              Handpicked premium items from trusted owners
            </Typography>
          </Box>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">Loading amazing items...</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {(featuredItemsData.length > 0 ? featuredItemsData : featuredItems).map((item: any) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
                <FeaturedItemCard onClick={() => navigate(`/item/${item.id}`)}>
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={item.images?.[0] || item.image}
                      alt={item.title || item.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <Box sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '20px',
                      px: 1.5,
                      py: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}>
                      <Star sx={{ color: '#FFD700', fontSize: '1rem' }} />
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {item.ratings?.average || item.rating}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      mb: 1, 
                      fontSize: '1.1rem',
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {item.title || item.name}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {item.location?.city ? `${item.location.city}, ${item.location.state}` : item.location}
                    </Typography>
                    
                    <Box sx={{ mt: 'auto' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 700, 
                          color: 'primary.main',
                          fontSize: '1.2rem',
                        }}>
                          {item.pricing ? `₹${item.pricing.daily}/day` : item.price}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({item.ratings?.count || item.reviews} reviews)
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </FeaturedItemCard>
              </Grid>
            ))}
          </Grid>
          )}
          
          <Box sx={{ textAlign: 'center', mt: 5 }}>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/listings')}
              sx={{ 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                }
              }}
            >
              View All Items
            </Button>
          </Box>
        </Box>

        {/* Call to Action */}
        <Box 
          sx={{ 
            position: 'relative',
            textAlign: 'center', 
            py: 8,
            background: 'linear-gradient(135deg, #007AFF15 0%, #FF950015 100%)',
            borderRadius: 4,
            mb: 6,
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23007AFF" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.5,
            }
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Start earning by listing your items
          </Typography>
          <Typography variant="h6" sx={{ 
            mb: 4, 
            color: 'text.secondary', 
            maxWidth: 700, 
            mx: 'auto',
            fontWeight: 400,
            lineHeight: 1.6,
          }}>
            Turn your unused items into income. List your furniture, electronics, tools, and more 
            to help others while earning money in a trusted community.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 3,
              }}
            >
              List your first item
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 3,
                borderWidth: 2,
                '&:hover': { borderWidth: 2 }
              }}
            >
              Learn how it works
            </Button>
          </Box>
        </Box>

        {/* Trust Indicators */}
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Trusted by thousands across India
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                10,000+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Items listed
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                5,000+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Happy users
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                25+
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Cities
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                4.8★
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Average rating
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;