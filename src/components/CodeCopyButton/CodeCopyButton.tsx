'use client';
import { useEffect } from 'react';

export const CodeCopyButton = () => {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('.znc pre');
    codeBlocks.forEach((pre) => {
      if (pre.querySelector('.copy-btn')) return;

      const btn = document.createElement('button');
      btn.className = 'copy-btn';
      btn.type = 'button';
      btn.textContent = 'コピー';
      btn.setAttribute('aria-label', 'コードをコピー');
      btn.addEventListener('click', () => {
        const code = pre.querySelector('code');
        if (code) {
          navigator.clipboard.writeText(code.textContent || '').then(() => {
            btn.textContent = 'コピーしました';
            btn.classList.add('copied');
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'code_copy', {
                event_category: 'Engagement',
                event_label: code.className || 'unknown',
              });
            }
            setTimeout(() => {
              btn.textContent = 'コピー';
              btn.classList.remove('copied');
            }, 2000);
          }).catch(() => {
            // HTTPS外や権限拒否で失敗することがある。無反応だと壊れて見えるので伝える
            btn.textContent = 'コピーできませんでした';
            setTimeout(() => { btn.textContent = 'コピー'; }, 2000);
          });
        }
      });
      // position は markdown.css の .znc pre で指定済み
      pre.appendChild(btn);
    });
  }, []);

  return null;
};
