'use client';
import { useEffect } from 'react';

export const OutboundLinkTracker = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;

    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;
      const href = link.href;
      if (!href || href.startsWith(window.location.origin) || href.startsWith('#') || href.startsWith('/')) return;

      window.gtag('event', 'outbound_click', {
        event_category: 'Outbound',
        event_label: href,
        transport_type: 'beacon',
      });
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
};
