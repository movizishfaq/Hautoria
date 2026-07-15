import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { connectDb } from '../src/config/db.js';
import { Product } from '../src/models/Product.js';
import { Coupon } from '../src/models/Coupon.js';
import { User } from '../src/models/User.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(__dirname, '../../src/lib/catalog.json');

type CatalogEntry = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  concerns: string[];
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  accent: string;
  badges: string[];
  ingredients: string[];
  featured?: boolean;
};

async function seed() {
  await connectDb();
  const raw = fs.readFileSync(catalogPath, 'utf-8');
  const catalog: CatalogEntry[] = JSON.parse(raw);

  await Product.deleteMany({});
  for (const item of catalog) {
    await Product.create({
      slug: item.slug,
      name: item.name,
      tagline: item.tagline,
      description: item.description,
      category: item.category,
      concerns: item.concerns,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      rating: item.rating,
      reviewCount: item.reviewCount,
      stock: item.stock,
      image: item.image,
      gallery: [item.image],
      accent: item.accent,
      badges: item.badges,
      ingredients: item.ingredients,
      featured: item.featured ?? false,
      sku: `HT-${item.id}`.toUpperCase().slice(0, 48),
      tags: item.concerns,
      brand: item.tagline,
      variants: [
        {
          id: `${item.id}-default`,
          name: 'Standard',
          sku: `HT-V-${item.id}`.toUpperCase().slice(0, 48),
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          stock: item.stock,
        },
      ],
    });
  }

  await Coupon.deleteMany({});
  await Coupon.insertMany([
    {
      code: 'GLOW10',
      description: '10% welcome ritual',
      type: 'percent',
      amount: 10,
      minPurchase: 0,
      usageLimit: 10000,
    },
    {
      code: 'VIP15',
      description: 'VIP Club 15% off',
      type: 'percent',
      amount: 15,
      minPurchase: 3000,
      maxDiscount: 2000,
      usageLimit: 5000,
    },
    {
      code: 'FREESHIP',
      description: 'Free shipping',
      type: 'free_shipping',
      amount: 0,
      minPurchase: 2000,
      usageLimit: 10000,
    },
  ]);

  const adminEmail = 'admin@hautoria.com';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({
      name: 'Hautoria Admin',
      email: adminEmail,
      passwordHash: await bcrypt.hash('Admin@123456', 12),
      role: 'admin',
      emailVerified: true,
      referralCode: 'ADMIN001',
      loyaltyPoints: 0,
      tier: 'Celeste',
      addresses: [],
    });
    console.log('Admin created: admin@hautoria.com / Admin@123456');
  }

  console.log(`Seeded ${catalog.length} products and coupons.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
