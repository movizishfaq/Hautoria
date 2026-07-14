import mongoose, { Schema, Document } from 'mongoose';

export interface IProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  reservedStock: number;
  color?: string;
  size?: string;
  weight?: number;
  barcode?: string;
  image?: string;
}

export interface IProduct extends Document {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  subcategory?: string;
  brand?: string;
  collectionName?: string;
  concerns: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  reservedStock: number;
  lowStockThreshold: number;
  image: string;
  gallery: string[];
  accent: string;
  badges: string[];
  ingredients: string[];
  tags: string[];
  sku: string;
  barcode?: string;
  weight?: number;
  isDigital: boolean;
  isActive: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  variants: IProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const variantSchema = new Schema<IProductVariant>(
  {
    id: String,
    name: String,
    sku: { type: String, index: true },
    price: Number,
    compareAtPrice: Number,
    stock: { type: Number, default: 0 },
    reservedStock: { type: Number, default: 0 },
    color: String,
    size: String,
    weight: Number,
    barcode: String,
    image: String,
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: 'text' },
    tagline: String,
    description: String,
    category: { type: String, index: true },
    subcategory: { type: String, index: true },
    brand: { type: String, index: true },
    collectionName: String,
    concerns: [String],
    price: { type: Number, required: true, index: true },
    compareAtPrice: Number,
    rating: { type: Number, default: 4.7 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0, index: true },
    reservedStock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 8 },
    image: String,
    gallery: [String],
    accent: String,
    badges: [String],
    ingredients: [String],
    tags: [{ type: String, index: true }],
    sku: { type: String, unique: true, sparse: true },
    barcode: String,
    weight: Number,
    isDigital: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    seoTitle: String,
    seoDescription: String,
    variants: [variantSchema],
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
