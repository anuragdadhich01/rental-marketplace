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
  background: 'linear-gradient(45deg, #FF5A5F 30%, #00A699 90%)',
  minHeight: '400px',
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
    background: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  maxWidth: 600,
  margin: '0 auto',
  borderRadius: '32px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '200px',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const FeaturedItemCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
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
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                mb: 2,
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              Rent anything, anywhere
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              From furniture to electronics, find what you need from people around you
            </Typography>
            
            {/* Search Bar */}
            <Box component="form" onSubmit={handleSearch}>
              <SearchBar>
                <InputBase
                  sx={{ ml: 2, flex: 1 }}
                  placeholder="What are you looking for?"
                  inputProps={{ 'aria-label': 'search items' }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>
              </SearchBar>
            </Box>
          </Box>
        </Container>
      </HeroSection>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Browse by Category */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            Browse by Category
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <CategoryCard>
                  <CardMedia
                    component="img"
                    height="140"
                    image={category.image}
                    alt={category.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.count}
                    </Typography>
                  </CardContent>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Items */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
            Featured Items
          </Typography>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Loading featured items...</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {(featuredItemsData.length > 0 ? featuredItemsData : featuredItems).map((item: any) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <FeaturedItemCard onClick={() => navigate(`/item/${item.id}`)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.images?.[0] || item.image}
                    alt={item.title || item.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                      {item.title || item.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Star sx={{ color: '#FFD700', fontSize: '1rem', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {item.ratings?.average || item.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({item.ratings?.count || item.reviews} reviews)
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {item.location?.city ? `${item.location.city}, ${item.location.state}` : item.location}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                      {item.pricing ? `₹${item.pricing.daily}/day` : item.price}
                    </Typography>
                  </CardContent>
                </FeaturedItemCard>
              </Grid>
            ))}
          </Grid>
          )}
        </Box>

        {/* Call to Action */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 6,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            mb: 4
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
            Start earning by listing your items
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
            Turn your unused items into income. List your furniture, electronics, tools, and more 
            to help others while earning money.
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            List your first item
          </Button>
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