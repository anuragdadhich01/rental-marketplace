import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { generateId } from '../utils/auth';
import { db } from '../utils/database';
import { ApiResponse, IItem, ItemCategory, ItemCondition } from '../types';

export const validateCreateItem = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['furniture', 'electronics', 'tools', 'sports', 'books', 'musical', 'appliances', 'vehicles', 'party', 'other']).withMessage('Invalid category'),
  body('condition').isIn(['new', 'like-new', 'good', 'fair', 'needs-repair']).withMessage('Invalid condition'),
  body('pricing.daily').isNumeric().withMessage('Daily price is required'),
  body('pricing.securityDeposit').isNumeric().withMessage('Security deposit is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required'),
];

export const createItem = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      data: errors.array()
    } as ApiResponse);
  }

  try {
    const userId = req.userId;
    const {
      title,
      description,
      category,
      subCategory,
      condition,
      pricing,
      location,
      specifications,
      policies
    } = req.body;

    // Mock image URLs for now - in real app, handle file uploads
    const images = req.body.images || ['https://via.placeholder.com/400x300?text=Item+Image'];

    const newItem: IItem = {
      id: generateId(),
      ownerId: userId,
      title,
      description,
      category: category as ItemCategory,
      subCategory,
      images,
      condition: condition as ItemCondition,
      pricing: {
        daily: pricing.daily,
        hourly: pricing.hourly,
        weekly: pricing.weekly,
        monthly: pricing.monthly,
        securityDeposit: pricing.securityDeposit
      },
      availability: {
        available: true,
        calendar: []
      },
      location: {
        city: location.city,
        state: location.state,
        address: location.address,
        coordinates: location.coordinates || { lat: 0, lng: 0 }
      },
      specifications,
      policies: {
        pickupDelivery: policies?.pickupDelivery || 'pickup',
        cancellationPolicy: policies?.cancellationPolicy || 'flexible',
        additionalRules: policies?.additionalRules
      },
      ratings: {
        average: 0,
        count: 0
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    const createdItem = await db.createItem(newItem);

    res.status(201).json({
      success: true,
      data: createdItem,
      message: 'Item created successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getItems = async (req: Request, res: Response) => {
  try {
    const {
      query,
      category,
      minPrice,
      maxPrice,
      city,
      condition,
      sortBy = 'newest',
      page = 1,
      limit = 20
    } = req.query;

    const filters: any = {};
    
    if (query) filters.query = query as string;
    if (category) filters.category = category as ItemCategory;
    if (city) filters.city = city as string;
    if (condition) filters.condition = condition as ItemCondition;
    
    if (minPrice || maxPrice) {
      filters.priceRange = {};
      if (minPrice) filters.priceRange.min = parseFloat(minPrice as string);
      if (maxPrice) filters.priceRange.max = parseFloat(maxPrice as string);
    }

    let items = await db.searchItems(filters);

    // Sort items
    switch (sortBy) {
      case 'price':
        items.sort((a, b) => a.pricing.daily - b.pricing.daily);
        break;
      case 'rating':
        items.sort((a, b) => b.ratings.average - a.ratings.average);
        break;
      case 'newest':
      default:
        items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedItems = items.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        items: paginatedItems,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(items.length / limitNum),
          totalItems: items.length,
          hasNext: endIndex < items.length,
          hasPrev: pageNum > 1
        }
      },
      message: 'Items retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getItemById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await db.getItemById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      } as ApiResponse);
    }

    // Get owner details (excluding password)
    const owner = await db.getUserById(item.ownerId);
    let ownerDetails = null;
    if (owner) {
      const { password: _, ...ownerData } = owner;
      ownerDetails = ownerData;
    }

    // Get reviews for this item
    const reviews = await db.getReviewsByItemId(id);

    res.json({
      success: true,
      data: {
        item,
        owner: ownerDetails,
        reviews
      },
      message: 'Item retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getUserItems = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const items = await db.getItemsByOwnerId(userId);

    res.json({
      success: true,
      data: items,
      message: 'User items retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateItem = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    
    const item = await db.getItemById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      } as ApiResponse);
    }

    // Check if user owns this item
    if (item.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this item'
      } as ApiResponse);
    }

    const updates = {
      ...req.body,
      updatedAt: new Date()
    };

    const updatedItem = await db.updateItem(id, updates);

    res.json({
      success: true,
      data: updatedItem,
      message: 'Item updated successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getFeaturedItems = async (req: Request, res: Response) => {
  try {
    const allItems = await db.getAllItems();
    
    // Get featured items (top rated, most popular, etc.)
    const featuredItems = allItems
      .filter(item => item.isActive && item.ratings.count > 0)
      .sort((a, b) => b.ratings.average - a.ratings.average)
      .slice(0, 8);

    res.json({
      success: true,
      data: featuredItems,
      message: 'Featured items retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};