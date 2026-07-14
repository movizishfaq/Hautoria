import type {
  Address,
  AdminAnalytics,
  Coupon,
  InventoryRecord,
  Order,
  Product,
  Review,
  User } from
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


export const demoAddress: Address = {
  id: 'addr_paris',
  label: 'Home',
  firstName: 'Camille',
  lastName: 'Laurent',
  line1: '18 Rue du Bac',
  city: 'Paris',
  state: 'Île-de-France',
  postalCode: '75007',
  country: 'France',
  phone: '+33 6 12 34 56 78',
  isDefault: true
};
export const demoUser: User = {
  id: 'usr_camille',
  name: 'Camille Laurent',
  email: 'camille@hautoria.demo',
  phone: demoAddress.phone,
  birthday: '1992-09-18',
  loyaltyPoints: 1240,
  tier: 'Gold',
  addresses: [demoAddress]
};

export const demoOrders: Order[] = [
{
  id: 'ord_10482',
  number: 'HT-10482',
  status: 'shipped',
  createdAt: '2026-07-11',
  total: 5597,
  subtotal: 5498,
  tax: 99,
  shipping: 0,
  discount: 0,
  paymentProvider: 'stripe',
  trackingNumber: 'DHL 003404342998',
  shippingAddress: demoAddress,
  items: [
  {
    productId: catalogProducts[0]?.id ?? 'fit-me-matte-tube-foundation-18ml',
    productName: catalogProducts[0]?.name ?? 'Fit Me Matte Tube Foundation 18ml',
    image: catalogProducts[0]?.image ?? '/catalog/fit-me-matte-tube-foundation-18ml.png',
    variantName: 'Standard',
    quantity: 1,
    unitPrice: catalogProducts[0]?.price ?? 1599
  },
  {
    productId: catalogProducts[1]?.id ?? 'the-ordinary-hyaluronic-acid-2-b5-30ml',
    productName: catalogProducts[1]?.name ?? 'The Ordinary Hyaluronic Acid 2% + B5 30ml',
    image: catalogProducts[1]?.image ?? '/catalog/the-ordinary-hyaluronic-acid-2-b5-30ml.png',
    variantName: 'Standard',
    quantity: 1,
    unitPrice: catalogProducts[1]?.price ?? 3899
  }],

  events: [
  {
    status: 'confirmed',
    label: 'Order confirmed',
    description: 'Your ritual is being prepared.',
    date: 'Jul 11, 10:18',
    completed: true
  },
  {
    status: 'packed',
    label: 'Packed with care',
    description: 'Your products passed our final ritual check.',
    date: 'Jul 12, 09:44',
    completed: true
  },
  {
    status: 'shipped',
    label: 'On its way',
    description: 'Collected by DHL Express.',
    date: 'Jul 12, 17:21',
    completed: true
  },
  {
    status: 'delivered',
    label: 'Delivered',
    description: 'Expected Jul 16.',
    date: 'Jul 16',
    completed: false
  }]

}];


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
  rating: 5,
  text: 'Quietly transformative. The glow is there without any irritation.',
  date: 'May 2026',
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
  revenue: 84290,
  orders: 684,
  customers: 1248,
  conversion: 4.8,
  series: [
  { label: 'Mon', value: 7600 },
  { label: 'Tue', value: 10200 },
  { label: 'Wed', value: 8900 },
  { label: 'Thu', value: 12800 },
  { label: 'Fri', value: 11600 },
  { label: 'Sat', value: 15400 },
  { label: 'Sun', value: 13790 }]

};