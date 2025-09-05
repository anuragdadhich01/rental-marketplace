import { Router } from 'express';
import { 
  getAdminStats,
  getAllUsers,
  getAllItems,
  updateUserStatus,
  updateItemStatus,
  deleteItem
} from '../controllers/adminController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// All admin routes require admin authentication
router.use(authenticateAdmin);

// Admin dashboard stats
router.get('/stats', getAdminStats);

// User management
router.get('/users', getAllUsers);
router.put('/users/:userId/status', updateUserStatus);

// Item management
router.get('/items', getAllItems);
router.put('/items/:itemId/status', updateItemStatus);
router.delete('/items/:itemId', deleteItem);

export default router;