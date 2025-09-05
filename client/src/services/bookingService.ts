import api from './api';

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'disputed';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'partial-refund' | 'failed';

export interface Booking {
  id: string;
  itemId: string;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  securityDeposit: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  pickupDetails?: {
    method: 'pickup' | 'delivery';
    address?: string;
    scheduledTime?: string;
    notes?: string;
  };
  returnDetails?: {
    returnedAt?: string;
    condition?: string;
    notes?: string;
    damageReported?: boolean;
  };
  messages: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  itemId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  securityDeposit: number;
  pickupDetails?: {
    method: 'pickup' | 'delivery';
    address?: string;
    scheduledTime?: string;
    notes?: string;
  };
}

export interface BookingResponse {
  success: boolean;
  data: Booking;
  message: string;
}

export interface BookingsResponse {
  success: boolean;
  data: Booking[];
  message: string;
}

export interface BookingDetailsResponse {
  success: boolean;
  data: {
    booking: Booking;
    item: any;
    renter: any;
    owner: any;
  };
  message: string;
}

class BookingService {
  async createBooking(bookingData: CreateBookingRequest): Promise<BookingResponse> {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  }

  async getBookings(type: 'renter' | 'owner' = 'renter'): Promise<BookingsResponse> {
    const response = await api.get(`/bookings?type=${type}`);
    return response.data;
  }

  async getBookingById(id: string): Promise<BookingDetailsResponse> {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  }

  async updateBookingStatus(id: string, status: BookingStatus, paymentStatus?: PaymentStatus): Promise<BookingResponse> {
    const response = await api.put(`/bookings/${id}/status`, {
      status,
      ...(paymentStatus && { paymentStatus })
    });
    return response.data;
  }

  async getRenterBookings(): Promise<BookingsResponse> {
    return this.getBookings('renter');
  }

  async getOwnerBookings(): Promise<BookingsResponse> {
    return this.getBookings('owner');
  }
}

export const bookingService = new BookingService();
export default bookingService;