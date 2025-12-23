export type PropertyType = 'apartment' | 'villa' | 'land' | 'building' | 'office';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'pending' | 'draft';

// src/types/index.ts
export interface IProperty {
  _id?: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  propertyType: 'apartment' | 'villa' | 'land' | 'building' | 'office';
  listingType: 'sale' | 'rent';
  status: 'available' | 'sold' | 'rented' | 'pending' | 'draft';
  location: {
    city: string;
    district: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  features: {
    area: number;
    bedrooms?: number;
    bathrooms?: number;
    floors?: number;
    yearBuilt?: number;
    furnished?: boolean;
    parking?: boolean;
    garden?: boolean;
    pool?: boolean;
    elevator?: boolean;
    security?: boolean;
    airConditioning?: boolean;
  };
  images: string[];
  video?: string;
  owner: any; // يمكن أن يكون ObjectId أو User object
  agent?: {
    name: string;
    phone: string;
    email: string;
    image?: string;
  };
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  propertyType?: string;
  listingType?: string;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  parking?: boolean;
  garden?: boolean;
  pool?: boolean;
  elevator?: boolean;
  security?: boolean;
  airConditioning?: boolean;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  role: 'user' | 'agent' | 'admin';
}