'use client';
import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const WebVitals = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;

    import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
      const sendToGA = ({ name, delta, id }: { name: string; delta: number; id: string }) => {
        window.gtag('event', name, {
          event_category: 'Web Vitals',
          value: Math.round(name === 'CLS' ? delta * 1000 : delta),
          event_label: id,
          non_interaction: true,
        });
      };

      onCLS(sendToGA);
      onINP(sendToGA);
      onLCP(sendToGA);
      onFCP(sendToGA);
      onTTFB(sendToGA);
    }).catch(() => {});
  }, []);

  return null;
};
