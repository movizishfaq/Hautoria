import { Router } from 'express';
import { Product } from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/sitemap.xml', asyncHandler(async (_req, res) => {
  const products = await Product.find({ isActive: true }).select('slug updatedAt');
  const base = env.clientUrl.replace(/\/$/, '');
  const urls = [
    { loc: `${base}/`, priority: '1.0' },
    { loc: `${base}/shop`, priority: '0.9' },
    { loc: `${base}/help`, priority: '0.5' },
    ...products.map((p) => ({
      loc: `${base}/products/${p.slug}`,
      priority: '0.8',
      lastmod: p.updatedAt?.toISOString().slice(0, 10),
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `<url><loc>${u.loc}</loc>${'lastmod' in u && u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>`;

  res.type('application/xml').send(xml);
}));

router.get('/robots.txt', (_req, res) => {
  const base = env.clientUrl.replace(/\/$/, '');
  res.type('text/plain').send(`User-agent: *
Allow: /
Sitemap: ${base}/api/seo/sitemap.xml
`);
});

export default router;
