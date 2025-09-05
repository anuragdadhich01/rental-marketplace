import { Router } from 'express';
import { 
  createBooking, 
  getBookings, 
  getBookingById, 
  updateBookingStatus,
  validateCreateBooking 
} from '../controllers/bookingController';
import { authenticateToken } from '../middleware/auth';
import { bookingLimiter } from '../middleware/security';

const router = Router();

// All booking routes require authentication
router.use(authenticateToken);

// Booking routes
router.post('/', bookingLimiter, validateCreateBooking, createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);

export default router;