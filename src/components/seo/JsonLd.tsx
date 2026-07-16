import { useEffect } from 'react';

const SCRIPT_ATTR = 'data-seo-jsonld';

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const graphs = Array.isArray(data) ? data : [data];

  useEffect(() => {
    if (graphs.length === 0) return undefined;

    document
      .querySelectorAll(`script[${SCRIPT_ATTR}]`)
      .forEach((node) => node.remove());

    graphs.forEach((graph, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute(SCRIPT_ATTR, String(index));
      script.textContent = JSON.stringify(graph);
      document.head.appendChild(script);
    });

    return () => {
      document
        .querySelectorAll(`script[${SCRIPT_ATTR}]`)
        .forEach((node) => node.remove());
    };
  }, [JSON.stringify(graphs)]);

  return null;
}
