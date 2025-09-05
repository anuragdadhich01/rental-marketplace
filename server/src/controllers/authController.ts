import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { hashPassword, comparePassword, generateTokens, generateId } from '../utils/auth';
import { db } from '../utils/database';
import { ApiResponse, IUser, LoginRequest, RegisterRequest } from '../types';

export const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').notEmpty().withMessage('First name is required'),
  body('lastName').notEmpty().withMessage('Last name is required'),
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      data: errors.array()
    } as ApiResponse);
  }

  try {
    const { email, password, firstName, lastName, phone }: RegisterRequest = req.body;

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      } as ApiResponse);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const newUser: IUser = {
      id: generateId(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: 'user',
      isVerified: false,
      verifications: {
        email: false,
        phone: false,
        identity: false
      },
      trustScore: 0,
      totalRentals: 0,
      totalListings: 0,
      joinedAt: new Date(),
      lastActiveAt: new Date()
    };

    const createdUser = await db.createUser(newUser);

    // Generate tokens
    const tokens = generateTokens(createdUser.id);

    // Remove password from response
    const { password: _, ...userResponse } = createdUser;

    res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        tokens
      },
      message: 'User registered successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      data: errors.array()
    } as ApiResponse);
  }

  try {
    const { email, password }: LoginRequest = req.body;

    // Find user by email
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      } as ApiResponse);
    }

    // Update last active
    await db.updateUser(user.id, { lastActiveAt: new Date() });

    // Generate tokens
    const tokens = generateTokens(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      data: {
        user: userResponse,
        tokens
      },
      message: 'Login successful'
    } as ApiResponse);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const user = await db.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
    }

    // Remove password from response
    const { password: _, ...userResponse } = user;

    res.json({
      success: true,
      data: userResponse,
      message: 'Profile retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};