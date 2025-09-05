// Database abstraction layer
// Supports both in-memory (development) and PostgreSQL (production) databases

import { IUser, IItem, IBooking, IReview } from '../types';

export interface DatabaseInterface {
  // User operations
  createUser(user: IUser): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;

  // Item operations
  createItem(item: IItem): Promise<IItem>;
  getItemById(id: string): Promise<IItem | null>;
  getItemsByOwnerId(ownerId: string): Promise<IItem[]>;
  searchItems(filters: any): Promise<IItem[]>;
  updateItem(id: string, updates: Partial<IItem>): Promise<IItem | null>;
  getAllItems(): Promise<IItem[]>;

  // Booking operations
  createBooking(booking: IBooking): Promise<IBooking>;
  getBookingById(id: string): Promise<IBooking | null>;
  getBookingsByUserId(userId: string): Promise<IBooking[]>;
  updateBooking(id: string, updates: Partial<IBooking>): Promise<IBooking | null>;
  getAllBookings(): Promise<IBooking[]>;

  // Review operations
  createReview(review: IReview): Promise<IReview>;
  getReviewsByItemId(itemId: string): Promise<IReview[]>;
  getReviewsByUserId(userId: string): Promise<IReview[]>;
}

// In-memory database implementation for development
export class InMemoryDB implements DatabaseInterface {
  private users: Map<string, IUser> = new Map();
  private items: Map<string, IItem> = new Map();
  private bookings: Map<string, IBooking> = new Map();
  private reviews: Map<string, IReview> = new Map();

  // User operations
  async createUser(user: IUser): Promise<IUser> {
    this.users.set(user.id, user);
    return user;
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return null;
  }

  // Item operations
  async createItem(item: IItem): Promise<IItem> {
    this.items.set(item.id, item);
    return item;
  }

  async getItemById(id: string): Promise<IItem | null> {
    return this.items.get(id) || null;
  }

  async getItemsByOwnerId(ownerId: string): Promise<IItem[]> {
    return Array.from(this.items.values()).filter(item => item.ownerId === ownerId);
  }

  async searchItems(filters: any): Promise<IItem[]> {
    let items = Array.from(this.items.values()).filter(item => item.isActive);

    if (filters.query) {
      const query = filters.query.toLowerCase();
      items = items.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      items = items.filter(item => item.category === filters.category);
    }

    if (filters.condition) {
      items = items.filter(item => item.condition === filters.condition);
    }

    if (filters.city) {
      items = items.filter(item => 
        item.location.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    if (filters.priceRange) {
      items = items.filter(item => {
        const price = item.pricing.daily;
        return (!filters.priceRange.min || price >= filters.priceRange.min) &&
               (!filters.priceRange.max || price <= filters.priceRange.max);
      });
    }

    return items;
  }

  async updateItem(id: string, updates: Partial<IItem>): Promise<IItem | null> {
    const item = this.items.get(id);
    if (item) {
      const updatedItem = { ...item, ...updates };
      this.items.set(id, updatedItem);
      return updatedItem;
    }
    return null;
  }

  // Booking operations
  async createBooking(booking: IBooking): Promise<IBooking> {
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async getBookingById(id: string): Promise<IBooking | null> {
    return this.bookings.get(id) || null;
  }

  async getBookingsByUserId(userId: string): Promise<IBooking[]> {
    return Array.from(this.bookings.values()).filter(booking => booking.renterId === userId);
  }

  async updateBooking(id: string, updates: Partial<IBooking>): Promise<IBooking | null> {
    const booking = this.bookings.get(id);
    if (booking) {
      const updatedBooking = { ...booking, ...updates };
      this.bookings.set(id, updatedBooking);
      return updatedBooking;
    }
    return null;
  }

  // Review operations
  async createReview(review: IReview): Promise<IReview> {
    this.reviews.set(review.id, review);
    return review;
  }

  async getReviewsByItemId(itemId: string): Promise<IReview[]> {
    return Array.from(this.reviews.values()).filter(review => review.itemId === itemId);
  }

  async getReviewsByUserId(userId: string): Promise<IReview[]> {
    return Array.from(this.reviews.values()).filter(review => review.reviewerId === userId);
  }

  // Utility methods
  async getAllUsers(): Promise<IUser[]> {
    return Array.from(this.users.values());
  }

  async getAllItems(): Promise<IItem[]> {
    return Array.from(this.items.values()).filter(item => item.isActive);
  }

  async getAllBookings(): Promise<IBooking[]> {
    return Array.from(this.bookings.values());
  }
}

// Import PostgreSQL implementation
import PostgresDB from './postgres';

class DatabaseFactory {
  private static instance: DatabaseInterface;

  static async getInstance(): Promise<DatabaseInterface> {
    if (!DatabaseFactory.instance) {
      const usePostgres = process.env.NODE_ENV === 'production' || process.env.USE_POSTGRES === 'true';
      
      if (usePostgres) {
        console.log('🐘 Initializing PostgreSQL database...');
        const postgresDB = new PostgresDB();
        try {
          await postgresDB.initializeTables();
          DatabaseFactory.instance = postgresDB;
          console.log('✅ PostgreSQL database initialized successfully');
        } catch (error) {
          console.warn('⚠️ PostgreSQL connection failed, falling back to in-memory database');
          console.error('PostgreSQL error:', error);
          DatabaseFactory.instance = new InMemoryDB();
        }
      } else {
        console.log('💾 Using in-memory database for development');
        DatabaseFactory.instance = new InMemoryDB();
      }
    }
    
    return DatabaseFactory.instance;
  }

  static async reset() {
    DatabaseFactory.instance = new InMemoryDB();
  }
}

// Export singleton instance
export const getDatabase = DatabaseFactory.getInstance;
export const resetDatabase = DatabaseFactory.reset;

// Legacy export for backward compatibility - will be removed later
export const db = {
  createUser: async (user: IUser) => (await getDatabase()).createUser(user),
  getUserById: async (id: string) => (await getDatabase()).getUserById(id),
  getUserByEmail: async (email: string) => (await getDatabase()).getUserByEmail(email),
  updateUser: async (id: string, updates: Partial<IUser>) => (await getDatabase()).updateUser(id, updates),
  createItem: async (item: IItem) => (await getDatabase()).createItem(item),
  getItemById: async (id: string) => (await getDatabase()).getItemById(id),
  getItemsByOwnerId: async (ownerId: string) => (await getDatabase()).getItemsByOwnerId(ownerId),
  searchItems: async (filters: any) => (await getDatabase()).searchItems(filters),
  updateItem: async (id: string, updates: Partial<IItem>) => (await getDatabase()).updateItem(id, updates),
  getAllItems: async () => (await getDatabase()).getAllItems(),
  getAllUsers: async () => (await getDatabase()).getAllUsers(),
  createBooking: async (booking: IBooking) => (await getDatabase()).createBooking(booking),
  getBookingById: async (id: string) => (await getDatabase()).getBookingById(id),
  getBookingsByUserId: async (userId: string) => (await getDatabase()).getBookingsByUserId(userId),
  updateBooking: async (id: string, updates: Partial<IBooking>) => (await getDatabase()).updateBooking(id, updates),
  getAllBookings: async () => (await getDatabase()).getAllBookings(),
  createReview: async (review: IReview) => (await getDatabase()).createReview(review),
  getReviewsByItemId: async (itemId: string) => (await getDatabase()).getReviewsByItemId(itemId),
  getReviewsByUserId: async (userId: string) => (await getDatabase()).getReviewsByUserId(userId),
};