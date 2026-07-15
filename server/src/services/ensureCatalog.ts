import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product } from '../models/Product.js';
import { logger } from '../utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

let seedPromise: Promise<void> | null = null;

function resolveCatalogPath() {
  const candidates = [
    path.resolve(__dirname, '../../data/catalog.json'),
    path.resolve(process.cwd(), 'server/data/catalog.json'),
    path.resolve(process.cwd(), 'src/lib/catalog.json'),
  ];
  return candidates.find((p) => fs.existsSync(p));
}

/**
 * If the products collection is empty (fresh Atlas / wiped DB),
 * seed the built-in Hautoria catalog so the storefront never goes blank.
 */
export async function ensureCatalogSeeded() {
  if (seedPromise) return seedPromise;
  seedPromise = (async () => {
    try {
      const count = await Product.countDocuments();
      if (count > 0) return;

      const catalogPath = resolveCatalogPath();
      if (!catalogPath) {
        logger.warn('Catalog seed file not found — shop may be empty until you run npm run seed');
        return;
      }

      const catalog: CatalogEntry[] = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));
      if (!catalog.length) return;

      await Product.insertMany(
        catalog.map((item) => ({
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
          isActive: true,
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
        }))
      );
      logger.info(`Auto-seeded ${catalog.length} products into MongoDB`);
    } catch (error) {
      logger.error(
        `Catalog auto-seed failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  })();
  return seedPromise;
}
