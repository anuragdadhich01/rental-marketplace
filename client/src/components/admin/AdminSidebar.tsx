import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  BookmarkBorder as BookingIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  ExitToApp as LogoutIcon,
  Home as HomeIcon,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  badge?: number;
}

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin',
    },
    {
      text: 'Users',
      icon: <PeopleIcon />,
      path: '/admin/users',
      badge: 3,
    },
    {
      text: 'Items',
      icon: <InventoryIcon />,
      path: '/admin/items',
      badge: 12,
    },
    {
      text: 'Bookings',
      icon: <BookingIcon />,
      path: '/admin/bookings',
      badge: 5,
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/admin/analytics',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/admin/settings',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' },
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#1C1C1E',
          color: 'white',
          border: 'none',
          backgroundImage: 'linear-gradient(180deg, #1C1C1E 0%, #2C2C2E 100%)',
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Admin Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: '#007AFF',
              width: 40,
              height: 40,
              mr: 2,
            }}
          >
            <AdminPanelSettings />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              Admin Panel
            </Typography>
            <Typography variant="caption" sx={{ color: '#8E8E93' }}>
              RentHub Management
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#48484A', mb: 2 }} />

        {/* Navigation Menu */}
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: isActive(item.path) ? '#007AFF' : 'transparent',
                  color: isActive(item.path) ? 'white' : '#8E8E93',
                  '&:hover': {
                    bgcolor: isActive(item.path) ? '#0056CC' : '#48484A',
                    color: 'white',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: 'inherit',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive(item.path) ? 600 : 400,
                    fontSize: '0.95rem',
                  }}
                />
                {item.badge && (
                  <Box
                    sx={{
                      bgcolor: '#FF3B30',
                      color: 'white',
                      borderRadius: '50%',
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {item.badge}
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ borderColor: '#48484A', my: 2 }} />

        {/* Quick Actions */}
        <List sx={{ px: 0 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/')}
              sx={{
                borderRadius: 2,
                color: '#8E8E93',
                '&:hover': {
                  bgcolor: '#48484A',
                  color: 'white',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText
                primary="Back to Site"
                primaryTypographyProps={{ fontSize: '0.95rem' }}
              />
            </ListItemButton>
          </ListItem>
          
          <ListItem disablePadding>
            <ListItemButton
              sx={{
                borderRadius: 2,
                color: '#FF3B30',
                mt: 1,
                '&:hover': {
                  bgcolor: '#FF3B3015',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ fontSize: '0.95rem' }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 3 }}>
        <Box
          sx={{
            p: 2,
            bgcolor: '#007AFF15',
            borderRadius: 2,
            border: '1px solid #007AFF30',
          }}
        >
          <Typography variant="caption" sx={{ color: '#007AFF', fontWeight: 600 }}>
            System Status
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', mt: 0.5 }}>
            All systems operational
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;