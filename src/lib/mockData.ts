import type {
  AdminAnalytics,
  Coupon,
  InventoryRecord,
  Product,
  Review } from
'../types/domain';
import catalogData from './catalog.json';

type CatalogEntry = (typeof catalogData)[number];

const makeProduct = (input: CatalogEntry): Product => ({
  id: input.id,
  slug: input.slug,
  name: input.name,
  tagline: input.tagline,
  description: input.description,
  category: input.category,
  concerns: input.concerns,
  price: input.price,
  compareAtPrice: input.compareAtPrice ?? undefined,
  rating: input.rating,
  reviewCount: input.reviewCount,
  stock: input.stock,
  image: input.image,
  gallery: [input.image],
  accent: input.accent,
  badges: input.badges,
  ingredients: input.ingredients,
  featured: input.featured,
  variants: [
    {
      id: `${input.id}-default`,
      name: 'Standard',
      sku: `HT-${input.id.toUpperCase().slice(0, 12)}`,
      price: input.price,
      compareAtPrice: input.compareAtPrice ?? undefined,
      stock: input.stock
    }
  ]
});

export const catalogProducts: Product[] = catalogData.map(makeProduct);

export const demoReviews: Review[] = [
{
  id: 'rev_1',
  productId: catalogProducts[1]?.id ?? 'the-ordinary-hyaluronic-acid-2-b5-30ml',
  author: 'Isabelle R.',
  rating: 5,
  text: 'My complexion feels cushioned, bright, and truly comfortable. It is my non-negotiable.',
  date: 'June 2026',
  verified: true
},
{
  id: 'rev_2',
  productId: catalogProducts[1]?.id ?? 'the-ordinary-hyaluronic-acid-2-b5-30ml',
  author: 'Naomi K.',
  rating: 4,
  text: 'Quietly transformative. The glow is there without any irritation.',
  date: 'May 2026',
  verified: true
},
{
  id: 'rev_3',
  productId: catalogProducts[4]?.id ?? 'mac-prep-prime-tube-primer-45ml',
  author: 'Hina S.',
  rating: 4,
  text: 'Blends smoothly under foundation. Took one extra day to arrive during a busy week.',
  date: 'April 2026',
  verified: false
},
{
  id: 'rev_4',
  productId: catalogProducts[12]?.id ?? 'cosrx-aloe-soothing-sun-cream-spf-50',
  author: 'Mariam T.',
  rating: 3,
  text: 'No white cast on my skin tone, which I love. Pump was stiff at first but loosened up.',
  date: 'March 2026',
  verified: true
}];

export const demoCoupons: Coupon[] = [
{
  code: 'GLOW10',
  description: 'Welcome ritual — 10% off',
  amount: 10,
  type: 'percent',
  active: true
},
{
  code: 'VIP15',
  description: 'VIP Club — 15% off',
  amount: 15,
  type: 'percent',
  active: true
}];

export const inventory: InventoryRecord[] = catalogProducts.map((product) => ({
  productId: product.id,
  sku: product.variants[0].sku,
  stock: product.stock,
  threshold: 8,
  updatedAt: 'Today, 09:20'
}));

export const adminAnalytics: AdminAnalytics = {
  revenue: 0,
  orders: 0,
  customers: 0,
  conversion: 0,
  series: [
  { label: 'Mon', value: 0 },
  { label: 'Tue', value: 0 },
  { label: 'Wed', value: 0 },
  { label: 'Thu', value: 0 },
  { label: 'Fri', value: 0 },
  { label: 'Sat', value: 0 },
  { label: 'Sun', value: 0 }]
};