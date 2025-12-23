import mongoose, { Schema, models } from 'mongoose';

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
  owner: mongoose.Types.ObjectId | string;
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

const PropertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    titleAr: {
      type: String,
      required: [true, 'Arabic title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    descriptionAr: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    propertyType: {
      type: String,
      enum: ['apartment', 'villa', 'land', 'building', 'office'],
      required: true,
    },
    listingType: {
      type: String,
      enum: ['sale', 'rent'],
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented', 'pending', 'draft'],
      default: 'available',
    },
    location: {
      city: { type: String, required: true },
      district: { type: String, required: true },
      address: { type: String, default: '' },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    features: {
      area: { type: Number, required: true },
      bedrooms: Number,
      bathrooms: Number,
      floors: Number,
      yearBuilt: Number,
      furnished: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      garden: { type: Boolean, default: false },
      pool: { type: Boolean, default: false },
      elevator: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: false },
    },
    images: [{ type: String }],
    video: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agent: {
      name: String,
      phone: String,
      email: String,
      image: String,
    },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

PropertySchema.index({ propertyType: 1, listingType: 1 });
PropertySchema.index({ 'location.city': 1, 'location.district': 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ 'features.area': 1 });
PropertySchema.index({ createdAt: -1 });
PropertySchema.index({ owner: 1 });
PropertySchema.index({ status: 1 });

const Property = models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;