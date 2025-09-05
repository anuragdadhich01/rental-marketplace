import { Pool, PoolClient } from 'pg';
import { IUser, IItem, IBooking, IReview } from '../types';
import { DatabaseInterface } from './database';

class PostgresDB implements DatabaseInterface {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'rental_marketplace',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'password',
    });
  }

  async initializeTables() {
    const client = await this.pool.connect();
    try {
      // Create users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          first_name VARCHAR(255) NOT NULL,
          last_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          avatar TEXT,
          bio TEXT,
          location JSONB,
          is_verified BOOLEAN DEFAULT false,
          verifications JSONB DEFAULT '{"email": false, "phone": false, "identity": false}',
          trust_score INTEGER DEFAULT 0,
          total_rentals INTEGER DEFAULT 0,
          total_listings INTEGER DEFAULT 0,
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create items table
      await client.query(`
        CREATE TABLE IF NOT EXISTS items (
          id VARCHAR(255) PRIMARY KEY,
          owner_id VARCHAR(255) REFERENCES users(id),
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          category VARCHAR(50) NOT NULL,
          sub_category VARCHAR(100),
          images JSONB DEFAULT '[]',
          condition VARCHAR(50) NOT NULL,
          pricing JSONB NOT NULL,
          availability JSONB DEFAULT '{"available": true, "calendar": []}',
          location JSONB NOT NULL,
          specifications JSONB DEFAULT '{}',
          policies JSONB NOT NULL,
          ratings JSONB DEFAULT '{"average": 0, "count": 0}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          is_active BOOLEAN DEFAULT true
        )
      `);

      // Create bookings table
      await client.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id VARCHAR(255) PRIMARY KEY,
          item_id VARCHAR(255) REFERENCES items(id),
          renter_id VARCHAR(255) REFERENCES users(id),
          owner_id VARCHAR(255) REFERENCES users(id),
          start_date TIMESTAMP NOT NULL,
          end_date TIMESTAMP NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          security_deposit DECIMAL(10,2) NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          payment_status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create reviews table
      await client.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          id VARCHAR(255) PRIMARY KEY,
          item_id VARCHAR(255) REFERENCES items(id),
          reviewer_id VARCHAR(255) REFERENCES users(id),
          booking_id VARCHAR(255) REFERENCES bookings(id),
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create indices for better performance
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
        CREATE INDEX IF NOT EXISTS idx_items_location ON items USING GIN(location);
        CREATE INDEX IF NOT EXISTS idx_items_owner ON items(owner_id);
        CREATE INDEX IF NOT EXISTS idx_bookings_renter ON bookings(renter_id);
        CREATE INDEX IF NOT EXISTS idx_bookings_item ON bookings(item_id);
        CREATE INDEX IF NOT EXISTS idx_reviews_item ON reviews(item_id);
      `);

      console.log('✅ Database tables initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing database tables:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // User operations
  async createUser(user: IUser): Promise<IUser> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO users (id, first_name, last_name, email, password, phone, avatar, bio, location, is_verified, verifications, trust_score, total_rentals, total_listings, joined_at, last_active_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `;
      const values = [
        user.id, user.firstName, user.lastName, user.email, user.password,
        user.phone, user.avatar, user.bio, JSON.stringify(user.location),
        user.isVerified, JSON.stringify(user.verifications), user.trustScore,
        user.totalRentals, user.totalListings, user.joinedAt, user.lastActiveAt
      ];
      const result = await client.query(query, values);
      return this.mapUserFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
      return result.rows[0] ? this.mapUserFromDB(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] ? this.mapUserFromDB(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const client = await this.pool.connect();
    try {
      const setClause = Object.keys(updates).map((key, index) => `${this.camelToSnake(key)} = $${index + 2}`).join(', ');
      const values = [id, ...Object.values(updates)];
      
      const query = `UPDATE users SET ${setClause}, last_active_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0] ? this.mapUserFromDB(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  // Item operations
  async createItem(item: IItem): Promise<IItem> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO items (id, owner_id, title, description, category, sub_category, images, condition, pricing, availability, location, specifications, policies, ratings, created_at, updated_at, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        RETURNING *
      `;
      const values = [
        item.id, item.ownerId, item.title, item.description, item.category,
        item.subCategory, JSON.stringify(item.images), item.condition,
        JSON.stringify(item.pricing), JSON.stringify(item.availability),
        JSON.stringify(item.location), JSON.stringify(item.specifications),
        JSON.stringify(item.policies), JSON.stringify(item.ratings),
        item.createdAt, item.updatedAt, item.isActive
      ];
      const result = await client.query(query, values);
      return this.mapItemFromDB(result.rows[0]);
    } finally {
      client.release();
    }
  }

  async getItemById(id: string): Promise<IItem | null> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM items WHERE id = $1', [id]);
      return result.rows[0] ? this.mapItemFromDB(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  async getItemsByOwnerId(ownerId: string): Promise<IItem[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM items WHERE owner_id = $1', [ownerId]);
      return result.rows.map(row => this.mapItemFromDB(row));
    } finally {
      client.release();
    }
  }

  async searchItems(filters: any): Promise<IItem[]> {
    const client = await this.pool.connect();
    try {
      let query = 'SELECT * FROM items WHERE is_active = true';
      const values: any[] = [];
      let valueIndex = 1;

      if (filters.query) {
        query += ` AND (title ILIKE $${valueIndex} OR description ILIKE $${valueIndex})`;
        values.push(`%${filters.query}%`);
        valueIndex++;
      }

      if (filters.category) {
        query += ` AND category = $${valueIndex}`;
        values.push(filters.category);
        valueIndex++;
      }

      if (filters.condition) {
        query += ` AND condition = $${valueIndex}`;
        values.push(filters.condition);
        valueIndex++;
      }

      if (filters.city) {
        query += ` AND location->>'city' ILIKE $${valueIndex}`;
        values.push(`%${filters.city}%`);
        valueIndex++;
      }

      if (filters.priceRange) {
        if (filters.priceRange.min) {
          query += ` AND (pricing->>'daily')::numeric >= $${valueIndex}`;
          values.push(filters.priceRange.min);
          valueIndex++;
        }
        if (filters.priceRange.max) {
          query += ` AND (pricing->>'daily')::numeric <= $${valueIndex}`;
          values.push(filters.priceRange.max);
          valueIndex++;
        }
      }

      query += ' ORDER BY created_at DESC';

      const result = await client.query(query, values);
      return result.rows.map(row => this.mapItemFromDB(row));
    } finally {
      client.release();
    }
  }

  async updateItem(id: string, updates: Partial<IItem>): Promise<IItem | null> {
    const client = await this.pool.connect();
    try {
      const setClause = Object.keys(updates).map((key, index) => `${this.camelToSnake(key)} = $${index + 2}`).join(', ');
      const values = [id, ...Object.values(updates)];
      
      const query = `UPDATE items SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`;
      const result = await client.query(query, values);
      return result.rows[0] ? this.mapItemFromDB(result.rows[0]) : null;
    } finally {
      client.release();
    }
  }

  async getAllItems(): Promise<IItem[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM items WHERE is_active = true ORDER BY created_at DESC');
      return result.rows.map(row => this.mapItemFromDB(row));
    } finally {
      client.release();
    }
  }

  async getAllUsers(): Promise<IUser[]> {
    const client = await this.pool.connect();
    try {
      const result = await client.query('SELECT * FROM users ORDER BY joined_at DESC');
      return result.rows.map(row => this.mapUserFromDB(row));
    } finally {
      client.release();
    }
  }

  // Booking operations (stub for now)
  async createBooking(booking: IBooking): Promise<IBooking> {
    // TODO: Implement booking creation
    return booking;
  }

  async getBookingById(id: string): Promise<IBooking | null> {
    // TODO: Implement get booking by id
    return null;
  }

  async getBookingsByUserId(userId: string): Promise<IBooking[]> {
    // TODO: Implement get bookings by user
    return [];
  }

  async updateBooking(id: string, updates: Partial<IBooking>): Promise<IBooking | null> {
    // TODO: Implement booking update
    return null;
  }

  async getAllBookings(): Promise<IBooking[]> {
    // TODO: Implement get all bookings
    return [];
  }

  // Review operations (stub for now)
  async createReview(review: IReview): Promise<IReview> {
    // TODO: Implement review creation
    return review;
  }

  async getReviewsByItemId(itemId: string): Promise<IReview[]> {
    // TODO: Implement get reviews by item
    return [];
  }

  async getReviewsByUserId(userId: string): Promise<IReview[]> {
    // TODO: Implement get reviews by user
    return [];
  }

  // Helper methods
  private mapUserFromDB(row: any): IUser {
    return {
      id: row.id,
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      password: row.password,
      phone: row.phone,
      avatar: row.avatar,
      bio: row.bio,
      location: row.location,
      isVerified: row.is_verified,
      verifications: row.verifications,
      trustScore: row.trust_score,
      totalRentals: row.total_rentals,
      totalListings: row.total_listings,
      joinedAt: row.joined_at,
      lastActiveAt: row.last_active_at
    };
  }

  private mapItemFromDB(row: any): IItem {
    return {
      id: row.id,
      ownerId: row.owner_id,
      title: row.title,
      description: row.description,
      category: row.category,
      subCategory: row.sub_category,
      images: row.images,
      condition: row.condition,
      pricing: row.pricing,
      availability: row.availability,
      location: row.location,
      specifications: row.specifications,
      policies: row.policies,
      ratings: row.ratings,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isActive: row.is_active
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }

  async close() {
    await this.pool.end();
  }
}

export default PostgresDB;