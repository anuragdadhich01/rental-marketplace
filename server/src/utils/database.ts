// In-memory database simulation
// In a real application, this would be replaced with a proper database like PostgreSQL

import { IUser, IItem, IBooking, IReview } from '../types';

export class InMemoryDB {
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
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
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
    if (!item) return null;
    
    const updatedItem = { ...item, ...updates };
    this.items.set(id, updatedItem);
    return updatedItem;
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
    return Array.from(this.bookings.values()).filter(
      booking => booking.renterId === userId || booking.ownerId === userId
    );
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
    return Array.from(this.reviews.values()).filter(review => review.revieweeId === userId);
  }

  // Utility methods
  async getAllUsers(): Promise<IUser[]> {
    return Array.from(this.users.values());
  }

  async getAllItems(): Promise<IItem[]> {
    return Array.from(this.items.values());
  }

  async getAllBookings(): Promise<IBooking[]> {
    return Array.from(this.bookings.values());
  }
}

// Singleton instance
export const db = new InMemoryDB();