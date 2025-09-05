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
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Block as BlockIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminService, { AdminItem } from '../../services/adminService';

const AdminItems: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<AdminItem | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const itemsData = await adminService.getAllItems();
      setItems(itemsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch items. Please try again.');
      console.error('Error fetching items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItemStatus = async (item: AdminItem) => {
    try {
      const updatedItem = await adminService.updateItemStatus(item.id, !item.isActive);
      setItems(items.map(i => i.id === item.id ? updatedItem : i));
      setAnchorEl(null);
      setSelectedItem(null);
    } catch (err) {
      setError('Failed to update item status. Please try again.');
      console.error('Error updating item:', err);
    }
  };

  const handleDeleteItem = async (item: AdminItem) => {
    try {
      await adminService.deleteItem(item.id);
      setItems(items.filter(i => i.id !== item.id));
      setAnchorEl(null);
      setSelectedItem(null);
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error('Error deleting item:', err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: AdminItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const getStatusChip = (item: AdminItem) => {
    return item.isActive 
      ? <Chip label="Active" color="success" size="small" />
      : <Chip label="Inactive" color="error" size="small" />;
  };

  const getCategoryChip = (category: string) => {
    const colors: { [key: string]: any } = {
      electronics: 'primary',
      furniture: 'secondary',
      tools: 'warning',
      sports: 'info',
      books: 'success',
    };
    return <Chip label={category} color={colors[category] || 'default'} size="small" variant="outlined" />;
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
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
                Item Management
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Review and manage all listed items ({items.length} total)
              </Typography>
            </Box>
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
                  placeholder="Search items..."
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
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Category</InputLabel>
                  <Select label="Category" defaultValue="">
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="furniture">Furniture</MenuItem>
                    <MenuItem value="tools">Tools</MenuItem>
                    <MenuItem value="sports">Sports</MenuItem>
                    <MenuItem value="books">Books</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>

          {/* Items Table */}
          <Card>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Pricing</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <img 
                            src={item.images[0] || '/placeholder.jpg'} 
                            alt={item.title}
                            style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                          />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.description.substring(0, 60)}...
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{getCategoryChip(item.category)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          Owner ID: {item.ownerId.substring(0, 8)}...
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{item.pricing.daily}/day
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Deposit: ₹{item.pricing.securityDeposit}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.location.city}, {item.location.state}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.ratings.average.toFixed(1)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ({item.ratings.count})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusChip(item)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, item)}
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
              <ViewIcon sx={{ mr: 1 }} />
              View Details
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <EditIcon sx={{ mr: 1 }} />
              Edit Item
            </MenuItem>
            <MenuItem 
              onClick={() => {
                if (selectedItem) {
                  handleToggleItemStatus(selectedItem);
                }
              }}
            >
              {selectedItem?.isActive ? <BlockIcon sx={{ mr: 1 }} /> : <ApproveIcon sx={{ mr: 1 }} />}
              {selectedItem?.isActive ? 'Deactivate' : 'Activate'}
            </MenuItem>
            <MenuItem 
              onClick={() => {
                if (selectedItem) {
                  handleDeleteItem(selectedItem);
                }
              }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Delete Item
            </MenuItem>
          </Menu>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminItems;