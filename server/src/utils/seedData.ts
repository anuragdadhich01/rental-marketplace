import { IItem, IUser, ItemCategory, ItemCondition } from '../types';
import { db } from './database';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Sample users
const sampleUsers: IUser[] = [
  {
    id: 'user-1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul@example.com',
    password: 'dummy-hash',
    phone: '+91-9876543210',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Tech enthusiast and gadget lover',
    role: 'user' as const,
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      coordinates: {
        lat: 19.0760,
        lng: 72.8777
      }
    },
    isVerified: true,
    verifications: {
      email: true,
      phone: true,
      identity: true
    },
    trustScore: 4.8,
    totalRentals: 45,
    totalListings: 12,
    joinedAt: new Date('2023-01-15'),
    lastActiveAt: new Date()
  },
  {
    id: 'user-2',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya@example.com',
    password: 'dummy-hash',
    phone: '+91-9876543211',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    bio: 'Photography enthusiast and camera expert',
    role: 'admin' as const,
    location: {
      city: 'Delhi',
      state: 'NCR',
      country: 'India',
      coordinates: {
        lat: 28.6139,
        lng: 77.2090
      }
    },
    isVerified: true,
    verifications: {
      email: true,
      phone: true,
      identity: true
    },
    trustScore: 4.9,
    totalRentals: 67,
    totalListings: 8,
    joinedAt: new Date('2023-02-20'),
    lastActiveAt: new Date()
  },
  {
    id: 'user-3',
    firstName: 'Arjun',
    lastName: 'Kumar',
    email: 'arjun@example.com',
    password: 'dummy-hash',
    phone: '+91-9876543212',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    bio: 'Office furniture and ergonomic solutions specialist',
    role: 'user' as const,
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      coordinates: {
        lat: 12.9716,
        lng: 77.5946
      }
    },
    isVerified: true,
    verifications: {
      email: true,
      phone: true,
      identity: false
    },
    trustScore: 4.7,
    totalRentals: 23,
    totalListings: 15,
    joinedAt: new Date('2023-03-10'),
    lastActiveAt: new Date()
  }
];

// Sample items
const sampleItems: IItem[] = [
  {
    id: 'item-1',
    ownerId: 'user-1',
    title: 'MacBook Pro 16" 2023',
    description: 'High-performance laptop perfect for development, design, and video editing. Excellent condition with original charger and box.',
    category: 'electronics' as ItemCategory,
    subCategory: 'laptop',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'
    ],
    condition: 'like-new' as ItemCondition,
    pricing: {
      daily: 2500,
      weekly: 15000,
      monthly: 50000,
      securityDeposit: 100000
    },
    availability: {
      available: true,
      calendar: []
    },
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Bandra West',
      coordinates: {
        lat: 19.0596,
        lng: 72.8295
      }
    },
    specifications: {
      processor: 'M3 Pro',
      ram: '18GB',
      storage: '512GB SSD',
      screen: '16-inch Liquid Retina XDR'
    },
    policies: {
      pickupDelivery: 'both',
      cancellationPolicy: 'flexible',
      additionalRules: 'Handle with care. No liquid near the device.'
    },
    ratings: {
      average: 4.9,
      count: 127
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: 'item-2',
    ownerId: 'user-2',
    title: 'Canon EOS R5 Camera',
    description: 'Professional full-frame mirrorless camera with 45MP sensor. Perfect for photography and 8K video recording.',
    category: 'electronics' as ItemCategory,
    subCategory: 'camera',
    images: [
      'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400'
    ],
    condition: 'like-new' as ItemCondition,
    pricing: {
      daily: 3000,
      weekly: 18000,
      monthly: 60000,
      securityDeposit: 150000
    },
    availability: {
      available: true,
      calendar: []
    },
    location: {
      city: 'Delhi',
      state: 'NCR',
      address: 'Connaught Place',
      coordinates: {
        lat: 28.6315,
        lng: 77.2167
      }
    },
    specifications: {
      sensor: '45MP Full-Frame CMOS',
      video: '8K RAW, 4K 120p',
      iso: '100-51200',
      mount: 'RF Mount'
    },
    policies: {
      pickupDelivery: 'pickup',
      cancellationPolicy: 'moderate',
      additionalRules: 'Must be handled by experienced photographers only.'
    },
    ratings: {
      average: 4.8,
      count: 89
    },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: 'item-3',
    ownerId: 'user-3',
    title: 'Herman Miller Ergonomic Chair',
    description: 'Premium ergonomic office chair for comfortable long working hours. Excellent back support and adjustable features.',
    category: 'furniture' as ItemCategory,
    subCategory: 'office-chair',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=400'
    ],
    condition: 'good' as ItemCondition,
    pricing: {
      daily: 800,
      weekly: 4500,
      monthly: 15000,
      securityDeposit: 25000
    },
    availability: {
      available: true,
      calendar: []
    },
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      address: 'Koramangala',
      coordinates: {
        lat: 12.9352,
        lng: 77.6245
      }
    },
    specifications: {
      material: 'Mesh and Aluminum',
      adjustable: 'Height, Lumbar, Armrests',
      warranty: '12 years',
      weight: '20kg'
    },
    policies: {
      pickupDelivery: 'delivery',
      cancellationPolicy: 'flexible',
      additionalRules: 'Delivery within 10km. Assembly service available.'
    },
    ratings: {
      average: 4.7,
      count: 156
    },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: 'item-4',
    ownerId: 'user-1',
    title: 'DJI Mavic Air 2 Drone',
    description: 'Professional drone with 4K camera and 34-minute flight time. Perfect for aerial photography and videography.',
    category: 'electronics' as ItemCategory,
    subCategory: 'drone',
    images: [
      'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=400',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400'
    ],
    condition: 'like-new' as ItemCondition,
    pricing: {
      daily: 1800,
      weekly: 10000,
      monthly: 35000,
      securityDeposit: 80000
    },
    availability: {
      available: true,
      calendar: []
    },
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      address: 'Hinjewadi',
      coordinates: {
        lat: 18.5904,
        lng: 73.7394
      }
    },
    specifications: {
      camera: '4K/60fps, 48MP photos',
      flightTime: '34 minutes',
      range: '10km',
      features: 'ActiveTrack 3.0, APAS 3.0'
    },
    policies: {
      pickupDelivery: 'pickup',
      cancellationPolicy: 'strict',
      additionalRules: 'Valid drone license required. No flying in restricted areas.'
    },
    ratings: {
      average: 4.6,
      count: 93
    },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: 'item-5',
    ownerId: 'user-2',
    title: 'Sony A7 III Mirrorless Camera',
    description: 'Full-frame mirrorless camera with excellent low-light performance. Includes 28-70mm kit lens.',
    category: 'electronics' as ItemCategory,
    subCategory: 'camera',
    images: [
      'https://images.unsplash.com/photo-1606983340075-6fa2be5e9c8f?w=400'
    ],
    condition: 'good' as ItemCondition,
    pricing: {
      daily: 2200,
      weekly: 12000,
      monthly: 40000,
      securityDeposit: 120000
    },
    availability: {
      available: true,
      calendar: []
    },
    location: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      address: 'T. Nagar',
      coordinates: {
        lat: 13.0827,
        lng: 80.2707
      }
    },
    specifications: {
      sensor: '24.2MP Full-Frame CMOS',
      video: '4K HDR, Full HD 120p',
      iso: '100-51200',
      stabilization: '5-axis in-body'
    },
    policies: {
      pickupDelivery: 'both',
      cancellationPolicy: 'moderate'
    },
    ratings: {
      average: 4.5,
      count: 67
    },
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date(),
    isActive: true
  },
  {
    id: 'item-6',
    ownerId: 'user-3',
    title: 'IKEA Standing Desk',
    description: 'Adjustable height standing desk perfect for home office. Electric height adjustment with memory settings.',
    category: 'furniture' as ItemCategory,
    subCategory: 'desk',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
    ],
    condition: 'like-new' as ItemCondition,
    pricing: {
      daily: 600,
      weekly: 3500,
      monthly: 12000,
      securityDeposit: 20000
    },
    availability: {
      available: true,
      calendar: []
    },
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      address: 'HITEC City',
      coordinates: {
        lat: 17.4435,
        lng: 78.3772
      }
    },
    specifications: {
      dimensions: '120cm x 80cm',
      heightRange: '70cm - 120cm',
      maxWeight: '80kg',
      power: 'Electric motor'
    },
    policies: {
      pickupDelivery: 'delivery',
      cancellationPolicy: 'flexible',
      additionalRules: 'Assembly required. Instructions provided.'
    },
    ratings: {
      average: 4.4,
      count: 45
    },
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date(),
    isActive: true
  }
];

export async function seedDatabase() {
  try {
    console.log('🌱 Seeding database with sample data...');
    
    // Add users
    for (const user of sampleUsers) {
      await db.createUser(user);
    }
    console.log(`✅ Added ${sampleUsers.length} sample users`);
    
    // Add items
    for (const item of sampleItems) {
      await db.createItem(item);
    }
    console.log(`✅ Added ${sampleItems.length} sample items`);
    
    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}