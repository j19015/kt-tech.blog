'use client';
import { useEffect, useRef, useState } from 'react';

export const FadeIn = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-500 ${
        hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } ${className}`}
      style={{ willChange: hasAnimated ? 'auto' : 'opacity, transform' }}
    >
      {children}
    </div>
  );
};
