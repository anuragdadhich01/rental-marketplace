import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  Slider
} from '@mui/material';
import { Search, FilterList, Star, LocationOn } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { itemService, Item, SearchFilters } from '../services/itemService';

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
}));

const FilterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  alignItems: 'center',
  marginTop: theme.spacing(2)
}));

const ItemCard = styled(Card)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
  },
  borderRadius: '12px',
  overflow: 'hidden'
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '&.active': {
    backgroundColor: theme.palette.primary.main,
    color: 'white'
  }
}));

const categories = [
  { value: 'furniture', label: 'Furniture' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'tools', label: 'Tools' },
  { value: 'sports', label: 'Sports' },
  { value: 'books', label: 'Books' },
  { value: 'musical', label: 'Musical' },
  { value: 'appliances', label: 'Appliances' },
  { value: 'vehicles', label: 'Vehicles' },
  { value: 'party', label: 'Party' },
  { value: 'other', label: 'Other' }
];

const conditions = [
  { value: 'new', label: 'New' },
  { value: 'like-new', label: 'Like New' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'needs-repair', label: 'Needs Repair' }
];

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' }
];

const ListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  // Available cities (would come from API in real app)
  const availableCities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: SearchFilters = {
        query: searchQuery || undefined,
        category: selectedCategory || undefined,
        condition: selectedCondition || undefined,
        city: selectedCity || undefined,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        sortBy,
        page: currentPage,
        limit: 12
      };

      // Remove empty filters
      Object.keys(filters).forEach(key => {
        if (!filters[key as keyof SearchFilters]) {
          delete filters[key as keyof SearchFilters];
        }
      });

      const response = await itemService.getItems(filters);
      
      if (response.success) {
        setItems(response.data.items);
        setTotalItems(response.data.pagination.totalItems);
      } else {
        setError('Failed to fetch items');
      }
    } catch (err) {
      setError('Failed to fetch items. Please try again.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchQuery, selectedCategory, selectedCondition, selectedCity, priceRange, sortBy, currentPage]);

  useEffect(() => {
    // Update URL params when filters change
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedCondition) params.set('condition', selectedCondition);
    if (selectedCity) params.set('city', selectedCity);
    if (sortBy !== 'newest') params.set('sortBy', sortBy);
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedCondition, selectedCity, sortBy, setSearchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchItems();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCondition('');
    setSelectedCity('');
    setPriceRange([0, 10000]);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleItemClick = (itemId: string) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Browse All Listings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {totalItems > 0 ? `${totalItems} items available` : 'Discover amazing items from people around you'}
        </Typography>
      </Box>

      {/* Search and Filters */}
      <SearchContainer>
        <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button type="submit" variant="contained" size="small">
                    Search
                  </Button>
                </InputAdornment>
              )
            }}
            sx={{ borderRadius: '8px' }}
          />
        </Box>

        <FilterContainer>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            <Typography variant="subtitle2">Filters:</Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Condition</InputLabel>
            <Select
              value={selectedCondition}
              label="Condition"
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              <MenuItem value="">All Conditions</MenuItem>
              {conditions.map((cond) => (
                <MenuItem key={cond.value} value={cond.value}>
                  {cond.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>City</InputLabel>
            <Select
              value={selectedCity}
              label="City"
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <MenuItem value="">All Cities</MenuItem>
              {availableCities.map((city) => (
                <MenuItem key={city} value={city}>
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ minWidth: 200, mx: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
            </Typography>
            <Slider
              value={priceRange}
              onChange={(_, newValue) => setPriceRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              step={100}
              valueLabelFormat={(value) => `₹${value}`}
            />
          </Box>

          <Button 
            variant="outlined" 
            size="small" 
            onClick={clearFilters}
            sx={{ ml: 'auto' }}
          >
            Clear Filters
          </Button>
        </FilterContainer>

        {/* Active Filters */}
        {(searchQuery || selectedCategory || selectedCondition || selectedCity) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
              Active filters:
            </Typography>
            {searchQuery && (
              <StyledChip
                label={`Search: "${searchQuery}"`}
                onDelete={() => setSearchQuery('')}
                size="small"
              />
            )}
            {selectedCategory && (
              <StyledChip
                label={`Category: ${categories.find(c => c.value === selectedCategory)?.label}`}
                onDelete={() => setSelectedCategory('')}
                size="small"
              />
            )}
            {selectedCondition && (
              <StyledChip
                label={`Condition: ${conditions.find(c => c.value === selectedCondition)?.label}`}
                onDelete={() => setSelectedCondition('')}
                size="small"
              />
            )}
            {selectedCity && (
              <StyledChip
                label={`City: ${selectedCity}`}
                onDelete={() => setSelectedCity('')}
                size="small"
              />
            )}
          </Box>
        )}
      </SearchContainer>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : items.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            No items found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search criteria or clearing some filters
          </Typography>
          <Button variant="contained" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </Box>
      ) : (
        <>
          {/* Items Grid */}
          <Grid container spacing={3}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <ItemCard onClick={() => handleItemClick(item.id)}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={item.images[0]}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                      {item.title}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Star sx={{ color: '#FFD700', fontSize: '1rem', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        {item.ratings.average}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({item.ratings.count} reviews)
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ fontSize: '1rem', mr: 0.5, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {item.location.city}, {item.location.state}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        ₹{item.pricing.daily}/day
                      </Typography>
                      <Chip 
                        label={item.condition.charAt(0).toUpperCase() + item.condition.slice(1)} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </ItemCard>
              </Grid>
            ))}
          </Grid>

          {/* Pagination could be added here */}
          {totalItems > 12 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {items.length} of {totalItems} items
              </Typography>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ListingPage;