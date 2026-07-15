export type ProductCategory =
'serum' |
'moisturizer' |
'oil' |
'cleanser' |
'treatment';
export type SkinConcern =
'hydration' |
'aging' |
'sensitivity' |
'clarity' |
'radiance';
export type OrderStatus =
| 'pending'
| 'confirmed'
| 'payment_verified'
| 'processing'
| 'packed'
| 'quality_checked'
| 'ready_to_ship'
| 'shipped'
| 'out_for_delivery'
| 'delivered'
| 'completed'
| 'cancelled'
| 'refund_requested'
| 'refund_approved'
| 'refund_completed'
| 'returned'
| 'rejected'
| 'refunded';
export type UserRole = 'customer' | 'admin' | 'manager' | 'sales' | 'support';
export type PaymentProvider =
'stripe' |
'paypal' |
'apple_pay' |
'google_pay' |
'cod' |
'bank_transfer' |
'easypaisa' |
'jazzcash' |
'nayapay' |
'sadapay';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  image?: string;
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  concerns: SkinConcern[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  gallery: string[];
  accent: string;
  badges: string[];
  ingredients: string[];
  variants: ProductVariant[];
  featured?: boolean;
}
export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  concern?: SkinConcern;
  image?: string;
}
export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
export interface WishlistItem {
  productId: string;
  createdAt: string;
}
export interface Address {
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
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  role?: UserRole;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  loyaltyPoints: number;
  tier: 'Rose' | 'Gold' | 'Celeste';
  addresses: Address[];
}
export interface PaymentMethod {
  id: string;
  provider: PaymentProvider;
  brand?: string;
  last4?: string;
  expiry?: string;
  isDefault?: boolean;
}
export interface OrderLine {
  productId: string;
  productName: string;
  image: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
}
export interface OrderEvent {
  status: OrderStatus;
  label: string;
  description: string;
  date: string;
  completed: boolean;
}
export interface Order {
  id: string;
  number: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  items: OrderLine[];
  shippingAddress: Address;
  paymentProvider: PaymentProvider;
  paymentStatus?: 'pending' | 'verified' | 'failed' | 'refunded';
  guestEmail?: string;
  trackingNumber?: string;
  notes?: string;
  events: OrderEvent[];
}
export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}
export interface Question {
  id: string;
  productId: string;
  author: string;
  question: string;
  answer?: string;
  date: string;
}
export interface Coupon {
  code: string;
  description: string;
  amount: number;
  type: 'percent' | 'fixed';
  active: boolean;
}
export interface GiftCard {
  code: string;
  balance: number;
  expiresAt?: string;
}
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  kind: 'order' | 'reward' | 'system';
}
export interface AdminAnalytics {
  revenue: number;
  orders: number;
  customers: number;
  conversion: number;
  products?: number;
  todayOrders?: number;
  todayRevenue?: number;
  pendingOrders?: number;
  completedOrders?: number;
  series: Array<{label: string;value: number;}>;
  pipeline?: Record<string, number>;
}
export interface InventoryRecord {
  productId: string;
  sku: string;
  stock: number;
  threshold: number;
  updatedAt: string;
}
export interface CheckoutDraft {
  email: string;
  address?: Address;
  shippingMethod: 'standard' | 'express';
  paymentProvider: PaymentProvider;
  couponCode?: string;
  giftCardCode?: string;
  giftNote?: string;
  usePoints: boolean;
}