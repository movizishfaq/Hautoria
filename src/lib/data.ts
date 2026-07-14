// Shared content data for the Hautoria luxury skincare experience.

export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  accent: string; // tailwind bg tint
};

export const HERO_BOTTLE = "/cb059319-2785-445b-869c-2f62ff3008f8.jpg";


export const PRODUCTS: Product[] = [
{
  id: 'resurrection-serum',
  name: 'Lumière Céleste',
  tagline: 'Résurrection Sérum',
  price: 148,
  image: HERO_BOTTLE,
  accent: 'bg-blush'
},
{
  id: 'renewal-cream',
  name: 'Velours Nuit',
  tagline: 'Renewal Night Crème',
  price: 132,
  image: "/48fc0826-b7fe-432d-9bd9-d33a0a941841.jpg",

  accent: 'bg-beige'
},
{
  id: 'botanical-oil',
  name: 'Élixir Botanique',
  tagline: 'Radiance Facial Oil',
  price: 96,
  image: "/6543add9-3e90-4701-9487-939f86d9cccd.jpg",

  accent: 'bg-sage'
}];


// Extended list for carousel / best-sellers reuse
export const SHOWCASE: Product[] = [
PRODUCTS[0],
PRODUCTS[1],
PRODUCTS[2],
{
  ...PRODUCTS[0],
  id: 's4',
  name: 'Aube Dorée',
  tagline: 'Vitamin C Concentré',
  price: 118
},
{
  ...PRODUCTS[1],
  id: 's5',
  name: 'Rosée Calme',
  tagline: 'Sensitive Barrier Balm',
  price: 88
},
{
  ...PRODUCTS[2],
  id: 's6',
  name: 'Pureté Claire',
  tagline: 'Acne Clarity Essence',
  price: 74
}];


export const INGREDIENT_IMG = "/28832f8f-d510-4bff-87b1-4a61a2976a99.jpg";


export const SKIN_IMG = "/eeef8845-ed8a-4bc7-9c3f-e284c8f93847.jpg";


export const COLLECTIONS = [
'Morning Routine',
'Night Routine',
'Acne Care',
'Sensitive Skin',
'Anti Aging',
'Hydration',
'Vitamin C',
'Bundles'];


export const INGREDIENTS = [
{
  name: 'Squalane Céleste',
  desc: "Weightless plant lipid that mirrors the skin's own moisture for a satin, cushioned glow.",
  x: '18%',
  y: '28%'
},
{
  name: 'Bakuchiol',
  desc: 'A gentle botanical retinol alternative that smooths and firms without irritation.',
  x: '68%',
  y: '20%'
},
{
  name: 'Rosehip Nectar',
  desc: 'Cold-pressed and rich in vitamin A to visibly renew tone and texture overnight.',
  x: '44%',
  y: '62%'
},
{
  name: 'Centella Asiatica',
  desc: "The soothing 'tiger herb' that calms redness and reinforces the skin barrier.",
  x: '80%',
  y: '58%'
}];


export const REVIEWS = [
{
  name: 'Isabelle R.',
  location: 'Paris',
  text: 'I have never felt more confident bare-faced. The Résurrection Sérum transformed my skin in three weeks.'
},
{
  name: 'Naomi K.',
  location: 'New York',
  text: 'It feels less like skincare and more like a nightly ritual I genuinely look forward to. Pure luxury.'
},
{
  name: 'Amara D.',
  location: 'London',
  text: "The glow is unreal. Strangers ask what I'm using. Worth every single penny."
},
{
  name: 'Sofia M.',
  location: 'Milan',
  text: 'Sensitive skin, finally soothed. The Rosée Calme balm is the only thing that never stings.'
},
{
  name: 'Yuki T.',
  location: 'Tokyo',
  text: 'Elegant, effective, and effortless. Hautoria understands what quiet luxury really means.'
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
  q: 'Are Hautoria formulas suitable for sensitive skin?',
  a: 'Every formula is dermatologically tested, fragrance-conscious, and built around barrier-first botanicals. Our Rosée Calme line is designed specifically for reactive skin.'
},
{
  q: 'Are your products cruelty-free and clean?',
  a: 'Always. Hautoria is 100% cruelty-free, vegan, and formulated without parabens, sulfates, or synthetic dyes — crafted in small batches for freshness.'
},
{
  q: 'How long until I see results?',
  a: 'Most members notice a visible glow within 7 days and meaningful improvements in tone and firmness within 4 to 6 weeks of consistent use.'
},
{
  q: 'Do you offer international shipping?',
  a: 'Yes. We ship worldwide with carbon-neutral delivery and complimentary express shipping for VIP Club members.'
}];