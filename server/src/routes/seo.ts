import { Router } from 'express';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';

const router = Router();

function loadCatalogSlugs(): string[] {
  try {
    const catalogPath = resolve(process.cwd(), 'src/lib/catalog.json');
    const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as { slug: string }[];
    return catalog.map((p) => p.slug);
  } catch {
    return [];
  }
}

router.get('/sitemap.xml', asyncHandler(async (_req, res) => {
  const base = env.clientUrl.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);

  let productUrls: { loc: string; lastmod?: string; priority: string }[] = [];

  try {
    const products = await Product.find({ isActive: true }).select('slug updatedAt');
    productUrls = products.map((p) => ({
      loc: `${base}/products/${p.slug}`,
      priority: '0.8',
      lastmod: p.updatedAt?.toISOString().slice(0, 10),
    }));
  } catch {
    productUrls = loadCatalogSlugs().map((slug) => ({
      loc: `${base}/products/${slug}`,
      priority: '0.8',
      lastmod: today,
    }));
  }

  const staticUrls = [
    { loc: `${base}/`, priority: '1.0' },
    { loc: `${base}/shop`, priority: '0.9' },
    { loc: `${base}/help`, priority: '0.6' },
    { loc: `${base}/legal/privacy`, priority: '0.4' },
    { loc: `${base}/legal/terms`, priority: '0.4' },
    { loc: `${base}/legal/shipping`, priority: '0.5' },
  ];

  const urls = [...staticUrls, ...productUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : `<lastmod>${today}</lastmod>`}<changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`;

  res.type('application/xml').send(xml);
}));

router.get('/robots.txt', (_req, res) => {
  const base = env.clientUrl.replace(/\/$/, '');
  res.type('text/plain').send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /account
Disallow: /checkout
Disallow: /cart
Disallow: /auth
Disallow: /orders/

Sitemap: ${base}/sitemap.xml
`);
});

export default router;
