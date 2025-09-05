import { Router } from 'express';
import { 
  createItem, 
  getItems, 
  getItemById, 
  getUserItems, 
  updateItem, 
  getFeaturedItems,
  validateCreateItem 
} from '../controllers/itemController';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', optionalAuth, getItems);
router.get('/featured', getFeaturedItems);
router.get('/:id', optionalAuth, getItemById);

// Protected routes
router.post('/', authenticateToken, validateCreateItem, createItem);
router.get('/user/my-items', authenticateToken, getUserItems);
router.put('/:id', authenticateToken, updateItem);

export default router;