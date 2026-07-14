import mongoose, { Schema, Document } from 'mongoose';

export interface IInventoryLog extends Document {
  productId: string;
  sku: string;
  change: number;
  reason: string;
  previousStock: number;
  newStock: number;
  orderId?: string;
  userId?: string;
  warehouse?: string;
  createdAt: Date;
}

const logSchema = new Schema<IInventoryLog>(
  {
    productId: { type: String, required: true, index: true },
    sku: String,
    change: Number,
    reason: String,
    previousStock: Number,
    newStock: Number,
    orderId: String,
    userId: String,
    warehouse: { type: String, default: 'main' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const InventoryLog = mongoose.model<IInventoryLog>('InventoryLog', logSchema);
