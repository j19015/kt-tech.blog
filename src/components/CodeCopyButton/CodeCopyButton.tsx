'use client';
import { useEffect } from 'react';

export const CodeCopyButton = () => {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('.znc pre');
    codeBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.textContent = 'Copy';
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        if (code) {
          navigator.clipboard.writeText(code.textContent || '').then(() => {
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'code_copy', {
                event_category: 'Engagement',
                event_label: code.className || 'unknown',
              });
            }
            setTimeout(() => {
              btn.textContent = 'Copy';
              btn.classList.remove('copied');
            }, 2000);
          });
        }
      });
      (pre as HTMLElement).style.position = 'relative';
      pre.appendChild(btn);
    });
  }, []);

  return null;
};
