import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as VerifyIcon,
  Email as EmailIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminService, { AdminUser } from '../../services/adminService';

const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminService.getAllUsers();
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (user: AdminUser) => {
    try {
      const updatedUser = await adminService.updateUserStatus(user.id, !user.isVerified);
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      setAnchorEl(null);
      setSelectedUser(null);
    } catch (err) {
      setError('Failed to update user status. Please try again.');
      console.error('Error updating user:', err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: AdminUser) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const getStatusChip = (user: AdminUser) => {
    if (!user.isVerified) {
      return <Chip label="Pending" color="warning" size="small" />;
    }
    return <Chip label="Active" color="success" size="small" />;
  };

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
        <AdminSidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { xs: 0, md: '280px' } }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AdminSidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: { xs: 0, md: '280px' } }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                User Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and monitor all registered users ({users.length} total)
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setDialogOpen(true)}
            >
              Add User
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Search and Filters */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flexGrow: 1 }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" defaultValue="">
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Verified</InputLabel>
                  <Select label="Verified" defaultValue="">
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Verified</MenuItem>
                    <MenuItem value="false">Unverified</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Verified</TableCell>
                    <TableCell>Trust Score</TableCell>
                    <TableCell>Listings</TableCell>
                    <TableCell>Rentals</TableCell>
                    <TableCell>Join Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar src={user.avatar} sx={{ width: 40, height: 40 }}>
                            {`${user.firstName} ${user.lastName}`.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {`${user.firstName} ${user.lastName}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {user.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">{user.email}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.phone || 'No phone'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={user.role === 'admin' ? 'Admin' : 'User'} 
                          color={user.role === 'admin' ? 'primary' : 'default'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{getStatusChip(user)}</TableCell>
                      <TableCell>
                        {user.isVerified ? (
                          <Chip
                            icon={<VerifyIcon />}
                            label="Verified"
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Chip label="Unverified" color="default" size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.trustScore}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            / 5.0
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.totalListings}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{user.totalRentals}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(user.joinedAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, user)}
                          size="small"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <EditIcon sx={{ mr: 1 }} />
              Edit User
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <EmailIcon sx={{ mr: 1 }} />
              Send Message
            </MenuItem>
            <MenuItem 
              onClick={() => {
                if (selectedUser) {
                  handleVerifyUser(selectedUser);
                }
              }}
            >
              <VerifyIcon sx={{ mr: 1 }} />
              {selectedUser?.isVerified ? 'Unverify User' : 'Verify User'}
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
              <BlockIcon sx={{ mr: 1 }} />
              Suspend User
            </MenuItem>
          </Menu>

          {/* Add User Dialog */}
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <TextField label="Full Name" fullWidth />
                <TextField label="Email" type="email" fullWidth />
                <TextField label="Phone" fullWidth />
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status">
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="contained" onClick={() => setDialogOpen(false)}>
                Add User
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminUsers;