import api from './api';

export interface Item {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  images: string[];
  condition: string;
  pricing: {
    hourly?: number;
    daily: number;
    weekly?: number;
    monthly?: number;
    securityDeposit: number;
  };
  availability: {
    available: boolean;
    calendar: any[];
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
    pickupDelivery: string;
    cancellationPolicy: string;
    additionalRules?: string;
  };
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ItemsResponse {
  success: boolean;
  data: {
    items: Item[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
  message: string;
}

export interface ItemResponse {
  success: boolean;
  data: {
    item: Item;
    owner: any;
    reviews: any[];
  };
  message: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  condition?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const itemService = {
  async getItems(filters: SearchFilters = {}): Promise<ItemsResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await api.get(`/items?${params.toString()}`);
    return response.data;
  },

  async getItemById(id: string): Promise<ItemResponse> {
    const response = await api.get(`/items/${id}`);
    return response.data;
  },

  async getFeaturedItems(): Promise<{ success: boolean; data: Item[]; message: string }> {
    const response = await api.get('/items/featured');
    return response.data;
  },

  async createItem(itemData: any): Promise<{ success: boolean; data: Item; message: string }> {
    const response = await api.post('/items', itemData);
    return response.data;
  },

  async updateItem(id: string, itemData: any): Promise<{ success: boolean; data: Item; message: string }> {
    const response = await api.put(`/items/${id}`, itemData);
    return response.data;
  },

  async getUserItems(): Promise<{ success: boolean; data: Item[]; message: string }> {
    const response = await api.get('/items/user/my-items');
    return response.data;
  }
};