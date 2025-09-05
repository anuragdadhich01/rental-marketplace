import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

// General rate limiting
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiting for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: {
    success: false,
    error: 'Too many authentication attempts, please try again later',
  },
  skipSuccessfulRequests: true,
});

// Rate limiting for item creation
export const createItemLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 item creations per hour
  message: {
    success: false,
    error: 'Too many items created, please try again later',
  },
});

// Speed limiting middleware
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per windowMs without delay
  delayMs: () => 500, // add 500ms of delay per request after delayAfter
  maxDelayMs: 20000, // max delay of 20 seconds
});

// Rate limiting for booking creation
export const bookingLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 booking requests per hour
  message: {
    success: false,
    error: 'Too many booking requests, please try again later',
  },
});