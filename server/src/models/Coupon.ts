import mongoose, { Schema, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  type: 'percent' | 'fixed' | 'free_shipping';
  amount: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt?: Date;
  active: boolean;
  createdAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, index: true },
    description: String,
    type: { type: String, enum: ['percent', 'fixed', 'free_shipping'], required: true },
    amount: { type: Number, required: true },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: Number,
    usageLimit: { type: Number, default: 1000 },
    usedCount: { type: Number, default: 0 },
    expiresAt: Date,
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
