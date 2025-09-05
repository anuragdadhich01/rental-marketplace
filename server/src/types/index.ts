export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  location?: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  isVerified: boolean;
  verifications: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
  trustScore: number;
  totalRentals: number;
  totalListings: number;
  joinedAt: Date;
  lastActiveAt: Date;
}

export interface IItem {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: ItemCategory;
  subCategory?: string;
  images: string[];
  condition: ItemCondition;
  pricing: {
    hourly?: number;
    daily: number;
    weekly?: number;
    monthly?: number;
    securityDeposit: number;
  };
  availability: {
    available: boolean;
    calendar: BookingPeriod[];
  };
  location: {
    city: string;
    state: string;
    address?: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  specifications?: Record<string, any>;
  policies: {
    pickupDelivery: 'pickup' | 'delivery' | 'both';
    cancellationPolicy: 'flexible' | 'moderate' | 'strict';
    additionalRules?: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface IBooking {
  id: string;
  itemId: string;
  renterId: string;
  ownerId: string;
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  securityDeposit: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  pickupDetails?: {
    method: 'pickup' | 'delivery';
    address?: string;
    scheduledTime?: Date;
    notes?: string;
  };
  returnDetails?: {
    returnedAt?: Date;
    condition?: string;
    notes?: string;
    damageReported?: boolean;
  };
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage {
  id: string;
  senderId: string;
  content: string;
  attachments?: string[];
  timestamp: Date;
  isRead: boolean;
}

export interface IReview {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  itemId: string;
  rating: number;
  comment: string;
  type: 'item' | 'user';
  createdAt: Date;
}

export type ItemCategory = 
  | 'furniture'
  | 'electronics'
  | 'tools'
  | 'sports'
  | 'books'
  | 'musical'
  | 'appliances'
  | 'vehicles'
  | 'party'
  | 'other';

export type ItemCondition = 'new' | 'like-new' | 'good' | 'fair' | 'needs-repair';

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'refunded'
  | 'partial-refund'
  | 'failed';

export interface BookingPeriod {
  start: Date;
  end: Date;
  bookingId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface SearchFilters {
  query?: string;
  category?: ItemCategory;
  location?: {
    city?: string;
    radius?: number; // in km
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  condition?: ItemCondition[];
  sortBy?: 'relevance' | 'price' | 'rating' | 'distance' | 'newest';
  sortOrder?: 'asc' | 'desc';
}