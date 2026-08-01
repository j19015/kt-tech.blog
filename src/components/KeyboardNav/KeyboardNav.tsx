'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  prevUrl?: string;
  nextUrl?: string;
}

export const KeyboardNav = ({ prevUrl, nextUrl }: Props) => {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      // IME変換中や編集可能な領域では発火させない。
      // 変換中の「j」でページ遷移するとバグにしか見えない。
      if (e.isComposing) return;
      if ((e.target as HTMLElement | null)?.isContentEditable) return;

      if (e.key === 'j' && nextUrl) {
        router.push(nextUrl);
      } else if (e.key === 'k' && prevUrl) {
        router.push(prevUrl);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevUrl, nextUrl, router]);

  return null;
};
