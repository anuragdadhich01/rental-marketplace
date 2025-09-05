import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  BookmarkBorder as BookingIcon,
  TrendingUp,
  TrendingDown,
  Settings,
  Notifications,
  Analytics,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalItems: number;
  activeBookings: number;
  revenue: number;
  growthRate: number;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'item_listed' | 'booking_created' | 'payment_received';
  message: string;
  timestamp: string;
  user?: string;
  amount?: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats] = useState<DashboardStats>({
    totalUsers: 5247,
    activeUsers: 1832,
    totalItems: 12456,
    activeBookings: 284,
    revenue: 89750,
    growthRate: 12.5,
  });

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'user_signup',
      message: 'New user registered',
      timestamp: '2 minutes ago',
      user: 'Priya Sharma',
    },
    {
      id: '2',
      type: 'item_listed',
      message: 'iPhone 14 Pro listed',
      timestamp: '5 minutes ago',
      user: 'Rahul Kumar',
    },
    {
      id: '3',
      type: 'booking_created',
      message: 'Camera booking confirmed',
      timestamp: '12 minutes ago',
      user: 'Anita Patel',
      amount: 2500,
    },
    {
      id: '4',
      type: 'payment_received',
      message: 'Payment received',
      timestamp: '18 minutes ago',
      amount: 1800,
    },
  ]);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+12%',
      positive: true,
      icon: <PeopleIcon />,
      color: '#007AFF',
    },
    {
      title: 'Active Items',
      value: stats.totalItems.toLocaleString(),
      change: '+8%',
      positive: true,
      icon: <InventoryIcon />,
      color: '#34C759',
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings.toLocaleString(),
      change: '+15%',
      positive: true,
      icon: <BookingIcon />,
      color: '#FF9500',
    },
    {
      title: 'Revenue',
      value: `₹${stats.revenue.toLocaleString()}`,
      change: '+18%',
      positive: true,
      icon: <TrendingUp />,
      color: '#FF3B30',
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { xs: 0, md: '280px' } }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome back! Here's what's happening with your marketplace.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton>
                <Notifications />
              </IconButton>
              <IconButton>
                <Settings />
              </IconButton>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 2,
                          bgcolor: `${stat.color}15`,
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Chip
                        label={stat.change}
                        size="small"
                        sx={{
                          bgcolor: stat.positive ? '#34C75915' : '#FF3B3015',
                          color: stat.positive ? '#34C759' : '#FF3B30',
                          fontWeight: 600,
                        }}
                        icon={stat.positive ? <TrendingUp sx={{ fontSize: 16 }} /> : <TrendingDown sx={{ fontSize: 16 }} />}
                      />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={3}>
            {/* Recent Activity */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Recent Activity
                    </Typography>
                    <Button size="small" onClick={() => navigate('/admin/activity')}>
                      View All
                    </Button>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {recentActivity.map((activity) => (
                      <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: activity.type === 'user_signup' ? '#007AFF15' : 
                                    activity.type === 'item_listed' ? '#34C75915' :
                                    activity.type === 'booking_created' ? '#FF950015' : '#FF3B3015',
                            color: activity.type === 'user_signup' ? '#007AFF' : 
                                   activity.type === 'item_listed' ? '#34C759' :
                                   activity.type === 'booking_created' ? '#FF9500' : '#FF3B30',
                          }}
                        >
                          {activity.type === 'user_signup' ? <PeopleIcon /> :
                           activity.type === 'item_listed' ? <InventoryIcon /> :
                           activity.type === 'booking_created' ? <BookingIcon /> : <TrendingUp />}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {activity.message}
                            {activity.user && ` by ${activity.user}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.timestamp}
                          </Typography>
                        </Box>
                        {activity.amount && (
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                            +₹{activity.amount}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Quick Actions
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                      startIcon={<PeopleIcon />}
                      onClick={() => navigate('/admin/users')}
                    >
                      Manage Users
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                      startIcon={<InventoryIcon />}
                      onClick={() => navigate('/admin/items')}
                    >
                      Review Items
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                      startIcon={<BookingIcon />}
                      onClick={() => navigate('/admin/bookings')}
                    >
                      View Bookings
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{ justifyContent: 'flex-start', py: 1.5 }}
                      startIcon={<Analytics />}
                      onClick={() => navigate('/admin/analytics')}
                    >
                      Analytics
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    System Status
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Server Load</Typography>
                      <Typography variant="body2" color="success.main">Good</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={35} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Database</Typography>
                      <Typography variant="body2" color="success.main">Healthy</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={78} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">API Response</Typography>
                      <Typography variant="body2" color="success.main">Fast</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={92} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;