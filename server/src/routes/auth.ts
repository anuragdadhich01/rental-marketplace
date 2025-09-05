import { Router } from 'express';
import { register, login, getProfile, validateRegister, validateLogin } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { authLimiter } from '../middleware/security';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, validateRegister, register);
router.post('/login', authLimiter, validateLogin, login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;