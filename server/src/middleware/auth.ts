import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { ApiResponse } from '../types';
import { db } from '../utils/database';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    } as ApiResponse);
  }

  try {
    const { userId, type } = verifyToken(token);
    
    if (type !== 'access') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type'
      } as ApiResponse);
    }

    req.userId = userId;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    } as ApiResponse);
  }
};

export const authenticateAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    } as ApiResponse);
  }

  try {
    const { userId, type } = verifyToken(token);
    
    if (type !== 'access') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type'
      } as ApiResponse);
    }

    // Get user to check role
    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Admin access required'
      } as ApiResponse);
    }

    req.userId = userId;
    req.userRole = user.role;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    } as ApiResponse);
  }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const { userId, type } = verifyToken(token);
      if (type === 'access') {
        req.userId = userId;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }

  next();
};