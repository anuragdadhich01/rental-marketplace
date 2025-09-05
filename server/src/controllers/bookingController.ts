import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { generateId } from '../utils/auth';
import { db } from '../utils/database';
import { ApiResponse, IBooking, BookingStatus, PaymentStatus } from '../types';

export const validateCreateBooking = [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('startDate').isISO8601().withMessage('Start date is required and must be valid'),
  body('endDate').isISO8601().withMessage('End date is required and must be valid'),
  body('totalAmount').isNumeric().withMessage('Total amount is required'),
  body('securityDeposit').isNumeric().withMessage('Security deposit is required'),
];

export const createBooking = async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      data: errors.array()
    } as ApiResponse);
  }

  try {
    const renterId = req.userId;
    const {
      itemId,
      startDate,
      endDate,
      totalAmount,
      securityDeposit,
      pickupDetails
    } = req.body;

    // Check if item exists and is available
    const item = await db.getItemById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      } as ApiResponse);
    }

    if (!item.availability.available) {
      return res.status(400).json({
        success: false,
        error: 'Item is not available for booking'
      } as ApiResponse);
    }

    // Check if user is not trying to book their own item
    if (item.ownerId === renterId) {
      return res.status(400).json({
        success: false,
        error: 'You cannot book your own item'
      } as ApiResponse);
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date'
      } as ApiResponse);
    }

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'Start date cannot be in the past'
      } as ApiResponse);
    }

    const newBooking: IBooking = {
      id: generateId(),
      itemId,
      renterId,
      ownerId: item.ownerId,
      startDate: start,
      endDate: end,
      totalAmount,
      securityDeposit,
      status: 'pending',
      paymentStatus: 'pending',
      pickupDetails,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const createdBooking = await db.createBooking(newBooking);

    res.status(201).json({
      success: true,
      data: createdBooking,
      message: 'Booking request created successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getBookings = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { type = 'renter' } = req.query;

    let bookings;
    if (type === 'owner') {
      // Get bookings where user is the owner
      const allBookings = await db.getAllBookings();
      bookings = allBookings.filter(booking => booking.ownerId === userId);
    } else {
      // Get bookings where user is the renter
      bookings = await db.getBookingsByUserId(userId);
    }

    // Sort by created date, newest first
    bookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    res.json({
      success: true,
      data: bookings,
      message: 'Bookings retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const getBookingById = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const booking = await db.getBookingById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      } as ApiResponse);
    }

    // Check if user is authorized to view this booking
    if (booking.renterId !== userId && booking.ownerId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this booking'
      } as ApiResponse);
    }

    // Get item details
    const item = await db.getItemById(booking.itemId);
    
    // Get renter and owner details (without passwords)
    const renter = await db.getUserById(booking.renterId);
    const owner = await db.getUserById(booking.ownerId);

    let renterDetails = null;
    let ownerDetails = null;

    if (renter) {
      const { password: _, ...renterData } = renter;
      renterDetails = renterData;
    }

    if (owner) {
      const { password: _, ...ownerData } = owner;
      ownerDetails = ownerData;
    }

    res.json({
      success: true,
      data: {
        booking,
        item,
        renter: renterDetails,
        owner: ownerDetails
      },
      message: 'Booking retrieved successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};

export const updateBookingStatus = async (req: any, res: Response) => {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await db.getBookingById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      } as ApiResponse);
    }

    // Check authorization based on status change
    if (status === 'confirmed' || status === 'cancelled') {
      // Only owner can confirm or cancel
      if (booking.ownerId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Only the item owner can change this status'
        } as ApiResponse);
      }
    } else if (status === 'completed') {
      // Either owner or renter can mark as completed
      if (booking.ownerId !== userId && booking.renterId !== userId) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to update this booking'
        } as ApiResponse);
      }
    }

    const updates: Partial<IBooking> = {
      updatedAt: new Date()
    };

    if (status && Object.values(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed']).includes(status)) {
      updates.status = status as BookingStatus;
    }

    if (paymentStatus && Object.values(['pending', 'paid', 'refunded', 'partial-refund', 'failed']).includes(paymentStatus)) {
      updates.paymentStatus = paymentStatus as PaymentStatus;
    }

    const updatedBooking = await db.updateBooking(id, updates);

    res.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully'
    } as ApiResponse);

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    } as ApiResponse);
  }
};