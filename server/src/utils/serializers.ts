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

export function toClientOrder(o: IOrder) {
  return {
    id: o._id.toString(),
    number: o.number,
    status: o.status,
    createdAt: o.createdAt?.toISOString?.() ?? String(o.createdAt),
    total: o.total,
    subtotal: o.subtotal,
    tax: o.tax,
    shipping: o.shipping,
    discount: o.discount,
    paymentProvider: o.paymentProvider,
    paymentStatus: o.paymentStatus,
    trackingNumber: o.trackingNumber,
    courier: o.courier,
    guestEmail: o.guestEmail,
    items: o.items,
    shippingAddress: o.shippingAddress,
    events: o.events?.map((e) => ({
      status: e.status,
      label: e.label,
      description: e.description,
      date: e.date instanceof Date ? e.date.toISOString() : e.date,
      completed: e.completed,
    })),
    notes: o.notes,
  };
}
