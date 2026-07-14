import mongoose, { Schema, Document } from 'mongoose';

export type UserRole =
  | 'customer'
  | 'admin'
  | 'manager'
  | 'sales'
  | 'support';

export interface IAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  profilePhoto?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  loyaltyPoints: number;
  tier: 'Rose' | 'Gold' | 'Celeste';
  addresses: IAddress[];
  wishlist: string[];
  recentlyViewed: string[];
  notificationPrefs: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
  referralCode: string;
  referredBy?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    id: String,
    label: String,
    firstName: String,
    lastName: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    phone: String,
    isDefault: Boolean,
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    phone: { type: String, sparse: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['customer', 'admin', 'manager', 'sales', 'support'],
      default: 'customer',
      index: true,
    },
    profilePhoto: String,
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    loyaltyPoints: { type: Number, default: 0 },
    tier: { type: String, enum: ['Rose', 'Gold', 'Celeste'], default: 'Rose' },
    addresses: [addressSchema],
    wishlist: [{ type: String }],
    recentlyViewed: [{ type: String }],
    notificationPrefs: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
    },
    referralCode: { type: String, unique: true, index: true },
    referredBy: String,
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
