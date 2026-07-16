import { useEffect } from 'react';
import { absoluteAsset, absoluteUrl, seoConfig } from '../lib/seoConfig';

export type SeoPayload = {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
};

const MANAGED_SELECTOR = '[data-seo-managed]';

function upsertMeta(
  key: string,
  content: string,
  attr: 'name' | 'property' = 'name'
) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    el.setAttribute('data-seo-managed', 'true');
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string) {
  const selector = `link[rel="${rel}"]`;
  let el = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    el.setAttribute('data-seo-managed', 'true');
    document.head.appendChild(el);
  }
  el.href = href;
}

function setRobots(noindex?: boolean) {
  if (noindex) {
    upsertMeta('robots', 'noindex, nofollow');
  } else {
    const el = document.head.querySelector('meta[name="robots"][data-seo-managed]');
    el?.remove();
  }
}

export function applySeo(payload: SeoPayload) {
  const canonical = absoluteUrl(payload.canonicalPath ?? '/');
  const ogImage = absoluteAsset(payload.ogImage ?? seoConfig.ogImagePath);
  const ogType = payload.ogType ?? 'website';

  document.title = payload.title;

  upsertMeta('description', payload.description);
  if (payload.keywords) upsertMeta('keywords', payload.keywords);

  upsertLink('canonical', canonical);

  upsertMeta('og:title', payload.title, 'property');
  upsertMeta('og:description', payload.description, 'property');
  upsertMeta('og:type', ogType, 'property');
  upsertMeta('og:url', canonical, 'property');
  upsertMeta('og:site_name', seoConfig.siteName, 'property');
  upsertMeta('og:image', ogImage, 'property');
  upsertMeta('og:locale', seoConfig.locale, 'property');

  upsertMeta('twitter:card', 'summary_large_image');
  upsertMeta('twitter:title', payload.title);
  upsertMeta('twitter:description', payload.description);
  upsertMeta('twitter:image', ogImage);
  if (seoConfig.twitterHandle) {
    upsertMeta('twitter:site', seoConfig.twitterHandle);
  }

  setRobots(payload.noindex);
}

export function useSeo(payload: SeoPayload | null) {
  useEffect(() => {
    if (!payload) return;
    applySeo(payload);
  }, [
    payload?.title,
    payload?.description,
    payload?.keywords,
    payload?.canonicalPath,
    payload?.ogImage,
    payload?.ogType,
    payload?.noindex,
  ]);
}
