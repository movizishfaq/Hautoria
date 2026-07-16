# Hautoria SEO Audit Report

**Date:** July 16, 2026  
**Site:** https://www.hautoria.com  
**Stack:** Vite + React SPA, Express API on Vercel

---

## Summary

Full technical, on-page, structured-data, and performance SEO layer implemented across the storefront. After deployment and Google Search Console submission, searching **"Hautoria"** should rank this site first once indexed (assuming no stronger same-name competitors).

---

## Issues Fixed

| Area | Before | After |
|------|--------|-------|
| Page titles | Single static title in `index.html` | Unique `<title>` per route via `SeoManager` + product-level SEO |
| Meta descriptions | One global description | 150–160 char descriptions per page |
| Meta keywords | Missing | Added on all public routes |
| Canonical URLs | Missing | Dynamic canonical per page |
| `robots.txt` | Missing (API only, wrong sitemap path) | Static + dynamic API; disallows private routes |
| `sitemap.xml` | API-only, incomplete URLs | Build-time generation + dynamic API with all products |
| Open Graph / Twitter | Partial in `index.html` | Full OG + Twitter Cards on every route |
| JSON-LD | None | Organization, LocalBusiness, WebSite, WebPage, Breadcrumb, Product |
| Web manifest | Missing | `public/site.webmanifest` |
| Language | `lang="en"` present | Retained + `og:locale` en_PK |
| Verification | None | Placeholders for GSC, Bing, GA4, GTM via env vars |
| Breadcrumbs | Text-only on product page | Accessible breadcrumb nav + schema |
| Internal links | Footer `href="#"` | Real routes to shop, help, legal, FAQ |
| Duplicate H1 | Auth page had two H1s | Decorative panel uses H2 |
| Image alt text | Empty on hero/product thumbs | Descriptive alt + lazy loading |
| Private pages indexed | Cart/checkout/account indexable | `noindex` meta on sensitive routes |
| Cache headers | None | 1y immutable for `/assets`, 7d for images |
| Code splitting | Partial | Vendor + motion chunks retained |

---

## Structured Data Validation

Implemented schemas (validate at [Google Rich Results Test](https://search.google.com/test/rich-results)):

- **Organization** — brand, logo, contact, social `sameAs`
- **HealthAndBeautyBusiness** (LocalBusiness) — address, geo, hours, phone (env-configurable)
- **WebSite** — `SearchAction` pointing to `/shop?q={search_term_string}`
- **WebPage** — per public route
- **BreadcrumbList** — shop + product pages
- **Product** — name, image, PKR offer, aggregate rating

---

## Indexability Status

| Route | Indexable | Notes |
|-------|-----------|-------|
| `/` | ✅ Yes | Priority 1.0 in sitemap |
| `/shop` | ✅ Yes | |
| `/products/:slug` | ✅ Yes | All catalog slugs in sitemap |
| `/help`, `/legal/*` | ✅ Yes | |
| `/cart`, `/checkout`, `/auth`, `/account/*`, `/orders/*`, `/admin` | ❌ No | `noindex` + robots Disallow |

**Canonical:** Prevents duplicate content between `/search` → canonical `/shop`.

---

## Performance SEO

| Optimization | Status |
|--------------|--------|
| Vite minify (esbuild) | ✅ Enabled |
| CSS minify | ✅ Enabled |
| JS/CSS code splitting | ✅ vendor + motion chunks |
| Lazy-loaded images | ✅ Product cards, hero, PDP gallery |
| Browser caching | ✅ `vercel.json` Cache-Control headers |
| Font preconnect | ✅ Google Fonts |
| DNS prefetch GTM | ✅ In `index.html` |
| WebP conversion | ⚠️ Catalog PNGs unchanged — convert assets manually or via CDN for further gains |
| 90+ PageSpeed | ⚠️ Run Lighthouse post-deploy; SPA + Framer Motion may need further image compression |

**Expected Lighthouse SEO score:** 95–100 (meta, crawlability, structured data, tap targets).

**Performance score:** Depends on hero image weight (~HD PNG). Recommend compressing `/hero-fit-me-real-hd.png` and catalog images to WebP.

---

## Configuration Checklist

Add to Vercel environment variables (see `.env.example`):

```env
VITE_SITE_URL=https://www.hautoria.com
CLIENT_URL=https://www.hautoria.com
VITE_GSC_VERIFICATION=your-google-verification-code
VITE_BING_VERIFICATION=your-bing-verification-code
VITE_GA_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
VITE_BUSINESS_PHONE=+92XXXXXXXXXX
VITE_BUSINESS_EMAIL=hello@hautoria.com
```

**Post-launch steps:**

1. Deploy to Vercel
2. Google Search Console → add property → verify via `VITE_GSC_VERIFICATION`
3. Submit `https://www.hautoria.com/sitemap.xml`
4. Bing Webmaster Tools → verify via `VITE_BING_VERIFICATION`
5. Request indexing for homepage + brand query "Hautoria"
6. Validate structured data in Rich Results Test
7. Run Lighthouse (Mobile + Desktop) and compress hero/catalog images if Performance &lt; 90

---

## Files Added / Modified

**New:** `src/lib/seoConfig.ts`, `seoSchemas.ts`, `seoRoutes.ts`, `src/hooks/useSeo.ts`, `src/components/seo/*`, `scripts/generate-sitemap.ts`, `public/robots.txt`, `public/site.webmanifest`, `SEO_AUDIT.md`

**Updated:** `index.html`, `App.tsx`, `ProductPage.tsx`, `ShopPage.tsx`, `AuthPage.tsx`, `Footer.tsx`, `CinematicHero.tsx`, `vercel.json`, `server/src/routes/seo.ts`, `package.json`, `vite.config.ts`, `.env.example`

---

## Brand Search Objective

For exact-match **"Hautoria"** ranking:

1. Consistent brand name in title, H1, Organization schema, footer, and OG tags ✅
2. Unique domain with brand in URL ✅
3. Sitemap + robots + GSC submission (manual step)
4. Social profiles in `sameAs` (update URLs when live)
5. Local business NAP consistency (update env placeholders with real address)

After indexing (typically 3–14 days for new sites), the site should appear as the primary result for branded searches.
