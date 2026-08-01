'use client';
import dynamic from 'next/dynamic';

/**
 * MermaidRenderer をクライアント専用の境界に隔離する。
 *
 * Edge Runtime 向けのビルドでは webpack が非同期チャンクを分割できず、
 * すべて1ファイルに畳み込まれる。そのため `import('mermaid')` を書いた
 * コンポーネントをそのまま置くと、mermaid 本体（3MB超）が Worker の
 * バンドルに載ってしまう。`ssr: false` でサーバー側のグラフから外す。
 */
const MermaidRenderer = dynamic(
  () => import('./MermaidRenderer').then((m) => m.MermaidRenderer),
  { ssr: false }
);

export const MermaidLoader = () => <MermaidRenderer />;
