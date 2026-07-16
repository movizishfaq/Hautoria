import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSeo } from '../../hooks/useSeo';
import { resolveRouteSeo } from '../../lib/seoRoutes';
import { globalSchemas, webPageSchema } from '../../lib/seoSchemas';
import { seoConfig } from '../../lib/seoConfig';
import { JsonLd } from './JsonLd';

function useVerificationMeta() {
  useEffect(() => {
    const tags: { name: string; content: string }[] = [];
    if (seoConfig.googleSiteVerification) {
      tags.push({ name: 'google-site-verification', content: seoConfig.googleSiteVerification });
    }
    if (seoConfig.bingSiteVerification) {
      tags.push({ name: 'msvalidate.01', content: seoConfig.bingSiteVerification });
    }
    tags.forEach(({ name, content }) => {
      let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        el.setAttribute('data-seo-managed', 'true');
        document.head.appendChild(el);
      }
      el.content = content;
    });
  }, []);
}

export function SeoManager() {
  const { pathname } = useLocation();
  useVerificationMeta();
  const routeSeo = useMemo(() => resolveRouteSeo(pathname), [pathname]);

  useSeo(
    routeSeo
      ? {
          title: routeSeo.title,
          description: routeSeo.description,
          keywords: routeSeo.keywords,
          canonicalPath: routeSeo.canonicalPath,
          noindex: routeSeo.noindex,
          ogType: routeSeo.ogType,
        }
      : null
  );

  const jsonLd = useMemo(() => {
    if (pathname.startsWith('/products/')) return [];
    if (!routeSeo) return globalSchemas();
    return [
      ...globalSchemas(),
      webPageSchema({
        name: routeSeo.title,
        description: routeSeo.description,
        path: routeSeo.canonicalPath,
      }),
    ];
  }, [routeSeo, pathname]);

  if (jsonLd.length === 0) return null;

  return <JsonLd data={jsonLd} />;
}
