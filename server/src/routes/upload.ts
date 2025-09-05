import { Router } from 'express';
import { uploadImage, uploadMultipleImages } from '../controllers/uploadController';
import { uploadSingle, uploadMultiple } from '../middleware/upload';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All upload routes require authentication
router.use(authenticateToken);

// Single image upload
router.post('/image', uploadSingle, uploadImage);

// Multiple images upload
router.post('/images', uploadMultiple, uploadMultipleImages);

export default router;