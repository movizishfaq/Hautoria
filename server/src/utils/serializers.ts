import type { IOrder } from '../models/Order.js';
import type { IProduct } from '../models/Product.js';

export function toClientProduct(p: IProduct) {
  return {
    id: p.slug,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    description: p.description,
    category: p.category,
    concerns: p.concerns,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    rating: p.rating,
    reviewCount: p.reviewCount,
    stock: p.stock,
    image: p.image,
    gallery: p.gallery?.length ? p.gallery : [p.image],
    accent: p.accent,
    badges: p.badges,
    ingredients: p.ingredients,
    featured: p.featured,
    brand: p.brand,
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      stock: v.stock,
      image: v.image,
    })),
  };
}

export function toAdminProduct(p: IProduct) {
  return {
    ...toClientProduct(p),
    isActive: p.isActive,
    sku: p.sku,
    brand: p.brand,
    lowStockThreshold: p.lowStockThreshold,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export function toClientOrder(o: IOrder | Record<string, unknown>) {
  const doc = o as IOrder & { _id: { toString(): string } };
  const createdAt = doc.createdAt;
  return {
    id: doc._id.toString(),
    number: doc.number,
    status: doc.status,
    createdAt:
      createdAt instanceof Date
        ? createdAt.toISOString()
        : String(createdAt ?? ''),
    total: doc.total,
    subtotal: doc.subtotal,
    tax: doc.tax,
    shipping: doc.shipping,
    discount: doc.discount,
    paymentProvider: doc.paymentProvider,
    paymentStatus: doc.paymentStatus,
    trackingNumber: doc.trackingNumber,
    courier: doc.courier,
    guestEmail: doc.guestEmail,
    items: doc.items,
    shippingAddress: doc.shippingAddress,
    events: doc.events?.map((e) => ({
      status: e.status,
      label: e.label,
      description: e.description,
      date: e.date instanceof Date ? e.date.toISOString() : e.date,
      completed: e.completed,
    })),
    notes: doc.notes,
  };
}
