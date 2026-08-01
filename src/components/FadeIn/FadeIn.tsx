'use client';
import { useEffect, useRef, useState } from 'react';

export const FadeIn = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // IntersectionObserver が使えない環境では、そのまま表示する
    if (typeof IntersectionObserver === 'undefined') {
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          // 一度表示したら監視は不要
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    // Observerが何らかの理由で発火しなくても、記事一覧が消えたままにならないようにする
    const fallback = setTimeout(() => setHasAnimated(true), 1500);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
    // 依存に hasAnimated を入れると、表示のたびに Observer を作り直すことになる
  }, []);

  return (
    <div
      ref={ref}
      // fade-in-pending は JS 無効時に globals.css 側で強制表示するためのフック
      className={`transition-all duration-500 ${
        hasAnimated ? 'opacity-100 translate-y-0' : 'fade-in-pending opacity-0 translate-y-3'
      } ${className}`}
      style={{ willChange: hasAnimated ? 'auto' : 'opacity, transform' }}
    >
      {children}
    </div>
  );
};
