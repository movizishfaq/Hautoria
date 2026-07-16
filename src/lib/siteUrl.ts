/** Production storefront URL — used for SEO, canonicals, sitemap, and JSON-LD. */
export const DEFAULT_SITE_URL = 'https://www.hautoria.com';

export function resolveSiteUrl(primary?: string, fallback?: string): string {
  return (primary ?? fallback ?? DEFAULT_SITE_URL).trim().replace(/\/$/, '');
}
