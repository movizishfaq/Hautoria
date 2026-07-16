import type { Product } from '../types/domain';
import { absoluteAsset, absoluteUrl, seoConfig } from './seoConfig';

export type BreadcrumbItem = { name: string; path: string };

export function organizationSchema() {
  const { localBusiness, siteUrl, logoPath } = seoConfig;
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: localBusiness.name,
    legalName: localBusiness.legalName,
    url: siteUrl,
    logo: absoluteAsset(logoPath),
    description: localBusiness.description,
    email: localBusiness.email,
    telephone: localBusiness.telephone,
    sameAs: localBusiness.sameAs,
  };
}

export function localBusinessSchema() {
  const { localBusiness, siteUrl, logoPath } = seoConfig;
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${siteUrl}/#localbusiness`,
    name: localBusiness.name,
    image: absoluteAsset(logoPath),
    url: siteUrl,
    telephone: localBusiness.telephone,
    email: localBusiness.email,
    priceRange: localBusiness.priceRange,
    address: {
      '@type': 'PostalAddress',
      ...localBusiness.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: localBusiness.geo.latitude,
      longitude: localBusiness.geo.longitude,
    },
    openingHoursSpecification: localBusiness.openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      description: hours,
    })),
    areaServed: localBusiness.areaServed,
    parentOrganization: { '@id': `${siteUrl}/#organization` },
  };
}

export function websiteSchema() {
  const { siteName, siteUrl, tagline } = seoConfig;
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: siteName,
    alternateName: 'Hautoria Beauty',
    url: siteUrl,
    description: tagline,
    publisher: { '@id': `${siteUrl}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function webPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const url = absoluteUrl(path);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': `${seoConfig.siteUrl}/#website` },
    about: { '@id': `${seoConfig.siteUrl}/#organization` },
    inLanguage: seoConfig.language,
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function productSchema(product: Product) {
  const url = absoluteUrl(`/products/${product.slug}`);
  const image = absoluteAsset(product.image);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: product.description || product.tagline,
    image: product.gallery?.length ? product.gallery.map(absoluteAsset) : [image],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: seoConfig.siteName,
    },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'PKR',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: { '@id': `${seoConfig.siteUrl}/#organization` },
    },
    aggregateRating:
      product.reviewCount > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          }
        : undefined,
  };
}

export function globalSchemas(): Record<string, unknown>[] {
  return [organizationSchema(), localBusinessSchema(), websiteSchema()];
}
