import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { ApiResponse } from '../types';
import { db } from '../utils/database';

export const getAdminStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await db.getAllUsers();
    const items = await db.getAllItems();
    const bookings = await db.getAllBookings();

    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isVerified).length,
      totalItems: items.length,
      activeItems: items.filter(i => i.isActive).length,
      totalBookings: bookings.length,
      activeBookings: bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length,
      adminUsers: users.filter(u => u.role === 'admin').length,
    };

    res.json({
      success: true,
      data: stats,
      message: 'Admin stats retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Error getting admin stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await db.getAllUsers();
    
    // Remove passwords from response
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    res.json({
      success: true,
      data: safeUsers,
      message: 'Users retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getAllItems = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const items = await db.getAllItems();

    res.json({
      success: true,
      data: items,
      message: 'Items retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Error getting items:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateUserStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    const user = await db.getUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      } as ApiResponse);
    }

    const updatedUser = await db.updateUser(userId, { isVerified });
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update user'
      } as ApiResponse);
    }

    // Remove password from response
    const { password, ...safeUser } = updatedUser;

    res.json({
      success: true,
      data: safeUser,
      message: 'User status updated successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateItemStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { itemId } = req.params;
    const { isActive } = req.body;

    const item = await db.getItemById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      } as ApiResponse);
    }

    const updatedItem = await db.updateItem(itemId, { isActive });
    if (!updatedItem) {
      return res.status(500).json({
        success: false,
        error: 'Failed to update item'
      } as ApiResponse);
    }

    res.json({
      success: true,
      data: updatedItem,
      message: 'Item status updated successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const deleteItem = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { itemId } = req.params;

    const item = await db.getItemById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      } as ApiResponse);
    }

    // Instead of deleting, set item as inactive
    const updatedItem = await db.updateItem(itemId, { isActive: false });
    if (!updatedItem) {
      return res.status(500).json({
        success: false,
        error: 'Failed to delete item'
      } as ApiResponse);
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};