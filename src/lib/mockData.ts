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

const serum = "/cb059319-2785-445b-869c-2f62ff3008f8.jpg";

const cream = "/48fc0826-b7fe-432d-9bd9-d33a0a941841.jpg";

const oil = "/6543add9-3e90-4701-9487-939f86d9cccd.jpg";

const botanicals = "/28832f8f-d510-4bff-87b1-4a61a2976a99.jpg";


const makeProduct = (
input: Omit<Product, 'gallery' | 'variants'>)
: Product => ({
  ...input,
  gallery: [input.image, serum, cream, oil],
  variants: [
  {
    id: `${input.id}-30`,
    name: '30 ml',
    sku: `HT-${input.id.toUpperCase()}-30`,
    price: input.price,
    stock: input.stock
  },
  {
    id: `${input.id}-50`,
    name: '50 ml',
    sku: `HT-${input.id.toUpperCase()}-50`,
    price: Math.round(input.price * 1.45),
    stock: Math.max(4, input.stock - 5)
  }]

});

export const catalogProducts: Product[] = [
makeProduct({
  id: 'resurrection-serum',
  slug: 'lumiere-celeste',
  name: 'Lumière Céleste',
  tagline: 'Résurrection Sérum',
  description:
  'A weightless renewal serum that floods the complexion with luminous, barrier-first hydration.',
  category: 'serum',
  concerns: ['hydration', 'radiance', 'aging'],
  price: 148,
  compareAtPrice: 168,
  rating: 4.9,
  reviewCount: 486,
  stock: 18,
  image: serum,
  accent: 'bg-blush',
  badges: ['Bestseller', 'Clinically tested'],
  ingredients: ['Squalane Céleste', 'Bakuchiol', 'Rosehip Nectar'],
  featured: true
}),
makeProduct({
  id: 'velours-nuit',
  slug: 'velours-nuit',
  name: 'Velours Nuit',
  tagline: 'Renewal Night Crème',
  description:
  'A cocooning overnight crème that smooths visible texture and leaves skin rested by morning.',
  category: 'moisturizer',
  concerns: ['aging', 'sensitivity', 'hydration'],
  price: 132,
  rating: 4.8,
  reviewCount: 327,
  stock: 7,
  image: cream,
  accent: 'bg-beige',
  badges: ['Night ritual'],
  ingredients: ['Bakuchiol', 'Ceramides', 'Centella Asiatica'],
  featured: true
}),
makeProduct({
  id: 'elixir-botanique',
  slug: 'elixir-botanique',
  name: 'Élixir Botanique',
  tagline: 'Radiance Facial Oil',
  description:
  'A silky, fast-absorbing botanical oil to seal in luminosity without a trace of weight.',
  category: 'oil',
  concerns: ['radiance', 'hydration'],
  price: 96,
  rating: 4.9,
  reviewCount: 271,
  stock: 24,
  image: oil,
  accent: 'bg-sage',
  badges: ['Cold pressed'],
  ingredients: ['Rosehip Nectar', 'Squalane Céleste', 'Vitamin E'],
  featured: true
}),
makeProduct({
  id: 'aube-doree',
  slug: 'aube-doree',
  name: 'Aube Dorée',
  tagline: 'Vitamin C Concentré',
  description:
  'A brightening morning concentrate with stabilized vitamin C and calming antioxidants.',
  category: 'treatment',
  concerns: ['radiance', 'clarity', 'aging'],
  price: 118,
  rating: 4.7,
  reviewCount: 188,
  stock: 12,
  image: serum,
  accent: 'bg-blush',
  badges: ['Morning essential'],
  ingredients: ['Vitamin C', 'Ferulic Acid', 'Niacinamide']
}),
makeProduct({
  id: 'rosee-calme',
  slug: 'rosee-calme',
  name: 'Rosée Calme',
  tagline: 'Sensitive Barrier Balm',
  description:
  'A gentle, restorative balm for moments when your skin asks for less and needs more.',
  category: 'moisturizer',
  concerns: ['sensitivity', 'hydration'],
  price: 88,
  rating: 4.9,
  reviewCount: 205,
  stock: 4,
  image: cream,
  accent: 'bg-beige',
  badges: ['Sensitive skin'],
  ingredients: ['Centella Asiatica', 'Ceramides', 'Oat Lipids']
}),
makeProduct({
  id: 'purete-claire',
  slug: 'purete-claire',
  name: 'Pureté Claire',
  tagline: 'Clarity Essence',
  description:
  'A balancing daily essence that refines the look of pores and softens congestion.',
  category: 'treatment',
  concerns: ['clarity', 'sensitivity'],
  price: 74,
  rating: 4.6,
  reviewCount: 156,
  stock: 31,
  image: botanicals,
  accent: 'bg-sage',
  badges: ['Clarifying'],
  ingredients: ['PHA', 'Zinc PCA', 'Green Tea']
})];


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
  total: 244.24,
  subtotal: 228,
  tax: 16.24,
  shipping: 0,
  discount: 0,
  paymentProvider: 'stripe',
  trackingNumber: 'DHL 003404342998',
  shippingAddress: demoAddress,
  items: [
  {
    productId: 'resurrection-serum',
    productName: 'Lumière Céleste',
    image: serum,
    variantName: '30 ml',
    quantity: 1,
    unitPrice: 148
  },
  {
    productId: 'rosee-calme',
    productName: 'Rosée Calme',
    image: cream,
    variantName: '30 ml',
    quantity: 1,
    unitPrice: 80
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
  productId: 'resurrection-serum',
  author: 'Isabelle R.',
  rating: 5,
  text: 'My complexion feels cushioned, bright, and truly comfortable. It is my non-negotiable.',
  date: 'June 2026',
  verified: true
},
{
  id: 'rev_2',
  productId: 'resurrection-serum',
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