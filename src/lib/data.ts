// Shared content data for the Hautoria luxury skincare experience.
import { catalogProducts } from './mockData';
import { formatPrice } from './formatPrice';
import { appConfig } from './config';

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  accent: string;
};

const toDisplayProduct = (product: (typeof catalogProducts)[number]): Product => ({
  id: product.id,
  name: product.name,
  tagline: product.name.split(' ').slice(0, 2).join(' '),
  price: product.price,
  compareAtPrice: product.compareAtPrice,
  image: product.image,
  accent: product.accent
});

export const HERO_BOTTLE = appConfig.heroImage;

export const PRODUCTS: Product[] = catalogProducts
  .filter((product) => product.featured)
  .slice(0, 3)
  .map(toDisplayProduct);

export const SHOWCASE: Product[] = catalogProducts.slice(0, 6).map(toDisplayProduct);

export { formatPrice };

export const INGREDIENT_IMG = "/28832f8f-d510-4bff-87b1-4a61a2976a99.jpg";

export const SKIN_IMG = "/eeef8845-ed8a-4bc7-9c3f-e284c8f93847.jpg";

export const COLLECTIONS = [
'Foundations & Primers',
'Serums & Treatments',
'Moisturizers & Creams',
'Cleansers',
'Sunscreen',
'Mascara & Makeup',
'K-Beauty',
'Bundles'];

export const INGREDIENTS = [
{
  name: 'Hyaluronic Acid',
  desc: 'Draws moisture into the skin for plump, dewy hydration that lasts all day.',
  x: '18%',
  y: '28%'
},
{
  name: 'Niacinamide',
  desc: 'Balances oil, refines pores, and visibly evens skin tone over time.',
  x: '68%',
  y: '20%'
},
{
  name: 'Ceramides',
  desc: 'Rebuild the skin barrier to lock in moisture and protect against irritation.',
  x: '44%',
  y: '62%'
},
{
  name: 'Centella Asiatica',
  desc: "Nature's calming herb that soothes redness and strengthens sensitive skin.",
  x: '80%',
  y: '58%'
}];

export const REVIEWS = [
{
  name: 'Isabelle R.',
  location: 'Karachi',
  rating: 5,
  text: 'Genuine products at prices I could not find anywhere else. The Ordinary serum arrived sealed and fresh.'
},
{
  name: 'Naomi K.',
  location: 'Lahore',
  rating: 4,
  text: 'Finally a store with real MAC and CeraVe at fair prices. Fast delivery and beautifully packaged.'
},
{
  name: 'Amara D.',
  location: 'Islamabad',
  rating: 5,
  text: 'The COSRX snail cream changed my skin. Hautoria made premium skincare actually affordable.'
},
{
  name: 'Sofia M.',
  location: 'Rawalpindi',
  rating: 4,
  text: 'Sensitive skin, finally soothed. Every product I ordered was authentic.'
},
{
  name: 'Yuki T.',
  location: 'Faisalabad',
  rating: 5,
  text: 'Competitive prices on luxury brands without compromising on quality. Highly recommend.'
},
{
  name: 'Hina S.',
  location: 'Multan',
  rating: 4,
  text: 'COD was easy and the box arrived intact. One item took an extra day but support kept me updated.'
},
{
  name: 'Rabia Q.',
  location: 'Peshawar',
  rating: 3,
  text: 'Good products overall. Gave three stars because my first order had a small delay during sale week.'
}];

export const QUIZ = [
{
  q: 'How does your skin feel by midday?',
  options: [
  'Tight & dry',
  'Balanced',
  'Shiny in the T-zone',
  'Sensitive & reactive']

},
{
  q: 'What is your primary skin goal?',
  options: [
  'Deep hydration',
  'Firming & anti-aging',
  'Clarity & even tone',
  'Calm & soothe']

},
{
  q: 'How would you describe your current routine?',
  options: [
  'Minimal',
  'A few steps',
  'A full ritual',
  'Still figuring it out']

}];

export const FAQS = [
{
  q: 'Are all products 100% authentic?',
  a: 'Yes. Every product in our catalog is sourced from verified suppliers. We guarantee authenticity on all brands including The Ordinary, CeraVe, MAC, and La Roche-Posay.'
},
{
  q: 'Why are your prices lower than other stores?',
  a: 'We work directly with suppliers and pass savings to you while maintaining healthy quality standards. Our prices are always below the average market rate.'
},
{
  q: 'How long does delivery take?',
  a: 'Orders within major cities are delivered in 2–4 business days. Nationwide delivery typically takes 4–7 business days.'
},
{
  q: 'Do you offer returns?',
  a: 'Unopened products can be returned within 7 days of delivery. Contact our support team to initiate a return.'
}];
