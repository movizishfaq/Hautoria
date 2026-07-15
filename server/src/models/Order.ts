import mongoose, { Schema, Document } from 'mongoose';

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'payment_verified',
  'processing',
  'packed',
  'quality_checked',
  'ready_to_ship',
  'shipped',
  'out_for_delivery',
  'delivered',
  'completed',
  'cancelled',
  'refund_requested',
  'refund_approved',
  'refund_completed',
  'returned',
  'rejected',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface IOrderLine {
  productId: string;
  productName: string;
  image: string;
  variantName: string;
  variantId: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface IOrderEvent {
  status: OrderStatus;
  label: string;
  description: string;
  date: Date;
  completed: boolean;
}

export interface IOrder extends Document {
  number: string;
  userId?: string;
  guestEmail?: string;
  status: OrderStatus;
  trackingNumber: string;
  courier?: string;
  estimatedDelivery?: Date;
  items: IOrderLine[];
  shippingAddress: Record<string, string>;
  billingAddress?: Record<string, string>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentProvider: string;
  paymentStatus: 'pending' | 'verified' | 'failed' | 'refunded';
  paymentReference?: string;
  events: IOrderEvent[];
  invoiceUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderLineSchema = new Schema<IOrderLine>(
  {
    productId: String,
    productName: String,
    image: String,
    variantName: String,
    variantId: String,
    sku: String,
    quantity: Number,
    unitPrice: Number,
  },
  { _id: false }
);

const orderEventSchema = new Schema<IOrderEvent>(
  {
    status: String,
    label: String,
    description: String,
    date: Date,
    completed: Boolean,
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    number: { type: String, required: true, unique: true, index: true },
    userId: { type: String, index: true },
    guestEmail: String,
    status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true },
    trackingNumber: { type: String, unique: true, index: true },
    courier: String,
    estimatedDelivery: Date,
    items: [orderLineSchema],
    shippingAddress: Schema.Types.Mixed,
    billingAddress: Schema.Types.Mixed,
    subtotal: Number,
    tax: Number,
    shipping: Number,
    discount: Number,
    total: Number,
    couponCode: String,
    paymentProvider: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'verified', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentReference: String,
    events: [orderEventSchema],
    invoiceUrl: String,
    notes: String,
  },
  { timestamps: true }
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', orderSchema);
