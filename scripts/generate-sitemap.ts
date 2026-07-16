import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

type CatalogProduct = { slug: string };

const siteUrl = (process.env.VITE_STORE_URL ?? 'https://hautoria.vercel.app').replace(/\/$/, '');
const catalogPath = resolve(process.cwd(), 'src/lib/catalog.json');
const catalog = JSON.parse(readFileSync(catalogPath, 'utf8')) as CatalogProduct[];

const staticPages = [
  { loc: `${siteUrl}/`, priority: '1.0', changefreq: 'daily' },
  { loc: `${siteUrl}/shop`, priority: '0.9', changefreq: 'daily' },
  { loc: `${siteUrl}/help`, priority: '0.6', changefreq: 'monthly' },
  { loc: `${siteUrl}/legal/privacy`, priority: '0.4', changefreq: 'yearly' },
  { loc: `${siteUrl}/legal/terms`, priority: '0.4', changefreq: 'yearly' },
  { loc: `${siteUrl}/legal/shipping`, priority: '0.5', changefreq: 'monthly' },
];

const productPages = catalog.map((product) => ({
  loc: `${siteUrl}/products/${product.slug}`,
  priority: '0.8',
  changefreq: 'weekly',
}));

const urls = [...staticPages, ...productPages];
const today = new Date().toISOString().slice(0, 10);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`
  )
  .join('\n')}
</urlset>
`;

const outPath = resolve(process.cwd(), 'public/sitemap.xml');
writeFileSync(outPath, xml, 'utf8');
console.log(`Sitemap written: ${outPath} (${urls.length} URLs)`);
