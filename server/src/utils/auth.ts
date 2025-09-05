import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AuthTokens } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRE || '30d';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateTokens = (userId: string): AuthTokens => {
  const accessToken = (jwt.sign as any)(
    { userId, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  const refreshToken = (jwt.sign as any)(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '90d' }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): { userId: string; type: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { userId: decoded.userId, type: decoded.type };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};