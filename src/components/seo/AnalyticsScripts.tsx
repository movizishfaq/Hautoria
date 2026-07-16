import { useEffect } from 'react';
import { seoConfig } from '../../lib/seoConfig';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

function injectScript(id: string, src: string, async = true) {
  if (document.getElementById(id)) return;
  const script = document.createElement('script');
  script.id = id;
  script.src = src;
  script.async = async;
  document.head.appendChild(script);
}

export function AnalyticsScripts() {
  const { gtmContainerId, gaMeasurementId } = seoConfig;

  useEffect(() => {
    if (gtmContainerId) {
      window.dataLayer = window.dataLayer ?? [];
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      injectScript('gtm-script', `https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}`);
    }

    if (gaMeasurementId && !gtmContainerId) {
      injectScript('ga4-script', `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`);
      window.dataLayer = window.dataLayer ?? [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaMeasurementId, { send_page_view: true });
    }
  }, [gtmContainerId, gaMeasurementId]);

  if (!gtmContainerId) return null;

  return (
    <noscript>
      <iframe
        title="Google Tag Manager"
        src={`https://www.googletagmanager.com/ns.html?id=${gtmContainerId}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
}
