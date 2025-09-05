import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  InputBase,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  NotificationsNone as NotificationIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '24px',
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  border: '1px solid #ddd',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
    minWidth: '300px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'white', color: 'text.primary', boxShadow: 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main',
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            RentHub
          </Typography>
        </Box>

        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ display: { xs: 'none', md: 'block' } }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: 'text.secondary' }} />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ color: 'text.primary' }}
            />
          </Search>
        </Box>

        {/* Right side - Auth/User Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated ? (
            <>
              {/* Admin Link - TODO: Add proper admin role check */}
              <Button
                variant="text"
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
                onClick={() => navigate('/admin')}
              >
                Admin
              </Button>

              {/* Host your item button */}
              <Button
                variant="text"
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
                onClick={() => navigate('/list-item')}
              >
                List your item
              </Button>

              {/* Notifications */}
              <IconButton size="medium" sx={{ color: 'text.primary' }}>
                <Badge badgeContent={3} color="error">
                  <NotificationIcon />
                </Badge>
              </IconButton>

              {/* User menu */}
              <IconButton
                onClick={handleMenuOpen}
                size="medium"
                sx={{ color: 'text.primary' }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </>
          ) : (
            <>
              <Button
                variant="text"
                sx={{ 
                  color: 'text.primary',
                  fontWeight: 600,
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
                onClick={() => navigate('/list-item')}
              >
                List your item
              </Button>
              
              <Button
                variant="text"
                sx={{ color: 'text.primary', fontWeight: 600 }}
                onClick={() => navigate('/login')}
              >
                Log in
              </Button>
              
              <Button
                variant="contained"
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' }
                }}
                onClick={() => navigate('/register')}
              >
                Sign up
              </Button>
            </>
          )}

          {/* Mobile menu */}
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 1 }}
        >
          {isAuthenticated ? (
            [
              <MenuItem key="profile" onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                Profile
              </MenuItem>,
              <MenuItem key="listings" onClick={() => { navigate('/my-listings'); handleMenuClose(); }}>
                My Listings
              </MenuItem>,
              <MenuItem key="bookings" onClick={() => { navigate('/bookings'); handleMenuClose(); }}>
                My Bookings
              </MenuItem>,
              <Divider key="divider" />,
              <MenuItem key="logout" onClick={() => { logout(); handleMenuClose(); navigate('/'); }}>
                Logout
              </MenuItem>
            ]
          ) : (
            [
              <MenuItem key="login" onClick={() => { navigate('/login'); handleMenuClose(); }}>
                Log in
              </MenuItem>,
              <MenuItem key="signup" onClick={() => { navigate('/register'); handleMenuClose(); }}>
                Sign up
              </MenuItem>
            ]
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;