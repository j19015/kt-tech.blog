'use client';
import { useEffect } from 'react';

/** これ以上の高さのコードブロックは折りたたむ（px） */
const COLLAPSE_THRESHOLD = 420;

/**
 * 記事本文のコードブロックに「コピー」と「折りたたみ」を後付けする。
 *
 * サーバー側でボタンまで出力してしまうと、JS が動かない環境で
 * 押しても何も起きないボタンが残る。DOM 操作で足すことで、
 * 実際に動く場合だけ操作系が現れるようにしている。
 */
export const CodeBlockEnhancer = () => {
  useEffect(() => {
    const cleanups: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>('.znc .code-block').forEach((block) => {
      const pre = block.querySelector('pre');
      const code = block.querySelector('code');
      const bar = block.querySelector('.code-block__bar');
      if (!pre || !code || !bar || block.dataset.enhanced === 'true') return;
      block.dataset.enhanced = 'true';

      // --- コピー ---
      const copy = document.createElement('button');
      copy.className = 'code-block__btn';
      copy.type = 'button';
      copy.textContent = 'コピー';
      copy.setAttribute('aria-label', 'コードをコピー');
      let resetTimer: ReturnType<typeof setTimeout> | undefined;
      const onCopy = () => {
        navigator.clipboard
          .writeText(code.textContent || '')
          .then(() => {
            copy.textContent = 'コピーしました';
            copy.classList.add('is-copied');
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'code_copy', {
                event_category: 'Engagement',
                event_label: code.className || 'unknown',
              });
            }
          })
          .catch(() => {
            // HTTPS外や権限拒否で失敗することがある。無反応だと壊れて見えるので伝える
            copy.textContent = 'コピーできませんでした';
          })
          .finally(() => {
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => {
              copy.textContent = 'コピー';
              copy.classList.remove('is-copied');
            }, 2000);
          });
      };
      copy.addEventListener('click', onCopy);
      bar.appendChild(copy);
      cleanups.push(() => {
        clearTimeout(resetTimer);
        copy.removeEventListener('click', onCopy);
      });

      // --- 折りたたみ ---
      // 設定ファイル全文のような長いコードは画面数枚分の高さになり、
      // 本文の流れが途切れる。一定の高さを超えるものだけ畳んでおく。
      if (pre.scrollHeight <= COLLAPSE_THRESHOLD) return;

      const toggle = document.createElement('button');
      toggle.className = 'code-block__expand';
      toggle.type = 'button';
      const sync = (collapsed: boolean) => {
        block.classList.toggle('is-collapsed', collapsed);
        toggle.textContent = collapsed ? 'すべて表示' : '折りたたむ';
        toggle.setAttribute('aria-expanded', String(!collapsed));
      };
      const onToggle = () => {
        const wasCollapsed = block.classList.contains('is-collapsed');
        sync(!wasCollapsed);
        // 閉じたときは先頭が画面外に飛びやすいので、ブロックの頭に戻す
        if (wasCollapsed === false) block.scrollIntoView({ block: 'nearest' });
      };
      toggle.addEventListener('click', onToggle);
      sync(true);
      block.appendChild(toggle);
      cleanups.push(() => toggle.removeEventListener('click', onToggle));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
};
