import api from './api';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  verifications: {
    email: boolean;
    phone: boolean;
    identity: boolean;
  };
  trustScore: number;
  totalRentals: number;
  totalListings: number;
  joinedAt: string;
  lastActiveAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalItems: number;
  activeItems: number;
  totalBookings: number;
  activeBookings: number;
  adminUsers: number;
}

export interface AdminItem {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  images: string[];
  condition: string;
  pricing: {
    daily: number;
    weekly?: number;
    monthly?: number;
    securityDeposit: number;
  };
  location: {
    city: string;
    state: string;
    address?: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

class AdminService {
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data.data;
  }

  async getAllUsers(): Promise<AdminUser[]> {
    const response = await api.get('/admin/users');
    return response.data.data;
  }

  async getAllItems(): Promise<AdminItem[]> {
    const response = await api.get('/admin/items');
    return response.data.data;
  }

  async updateUserStatus(userId: string, isVerified: boolean): Promise<AdminUser> {
    const response = await api.put(`/admin/users/${userId}/status`, { isVerified });
    return response.data.data;
  }

  async updateItemStatus(itemId: string, isActive: boolean): Promise<AdminItem> {
    const response = await api.put(`/admin/items/${itemId}/status`, { isActive });
    return response.data.data;
  }

  async deleteItem(itemId: string): Promise<void> {
    await api.delete(`/admin/items/${itemId}`);
  }
}

export default new AdminService();