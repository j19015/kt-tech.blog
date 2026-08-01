'use client';
import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * ```mermaid のコードブロックを図に差し替える。
 *
 * Mermaid は DOM とレイアウト計測に依存するため Edge Runtime では動かない。
 * そこでサーバーは定義をコードのまま出し、ここでクライアント側で SVG にする。
 * mermaid 本体は動的 import なので、図のない記事では読み込まれない。
 */
export const MermaidRenderer = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>('.znc .mermaid-block'));
    if (blocks.length === 0) return;

    let cancelled = false;

    import('mermaid')
      .then(async ({ default: mermaid }) => {
        if (cancelled) return;
        mermaid.initialize({
          startOnLoad: false,
          theme: resolvedTheme === 'dark' ? 'dark' : 'default',
          // 記事本文に埋め込まれる図なので、外部由来のスクリプトは通さない
          securityLevel: 'strict',
          // 失敗時に mermaid が body 直下へ独自のエラー図を差し込むのを止める
          suppressErrorRendering: true,
          fontFamily: 'inherit',
        });

        for (let i = 0; i < blocks.length; i += 1) {
          if (cancelled) return;
          const block = blocks[i];
          const figure = block.querySelector('.mermaid-block__figure') as HTMLElement | null;
          const source = block.querySelector('code')?.textContent ?? '';
          if (!figure || !source.trim()) continue;
          try {
            // テーマを変えると再描画するため、id が衝突しないようテーマ名を混ぜる
            const id = `mermaid-${i}-${resolvedTheme === 'dark' ? 'dark' : 'light'}`;
            const { svg } = await mermaid.render(id, source);
            if (cancelled) return;
            figure.innerHTML = svg;
            figure.removeAttribute('aria-hidden');
            block.classList.add('is-rendered');
          } catch {
            // 構文エラーのときは定義をコードのまま見せる。
            // 図が消えるより、どこが間違っているか読める方がまだ役に立つ
            figure.innerHTML = '';
            block.classList.remove('is-rendered');
          }
        }
      })
      .catch(() => {
        // チャンクの取得に失敗しても、定義はコードとして残っているので記事は読める
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedTheme]);

  return null;
};
