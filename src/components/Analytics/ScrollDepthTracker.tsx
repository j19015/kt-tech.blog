'use client';
import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const ScrollDepthTracker = () => {
  const firedRef = useRef(new Set<number>());

  useEffect(() => {
    if (typeof window === 'undefined' || !window.gtag) return;

    const thresholds = [25, 50, 75, 100];
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const t of thresholds) {
        if (percent >= t && !firedRef.current.has(t)) {
          firedRef.current.add(t);
          window.gtag('event', 'scroll_depth', {
            event_category: 'Engagement',
            event_label: `${t}%`,
            value: t,
            non_interaction: true,
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return null;
};
