export type PropertyType = 'apartment' | 'villa' | 'land' | 'building' | 'office';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'pending';

export interface IProperty {
  _id?: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
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
  owner: string;
  agent?: {
    name: string;
    phone: string;
    email: string;
    image?: string;
  };
  views: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'agent' | 'admin';
  image?: string;
  favorites: string[];
  createdAt: Date;
}

export interface PropertyFilters {
  propertyType?: PropertyType;
  listingType?: ListingType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
}