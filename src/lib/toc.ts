export type TocItem = { text: string; id: string; tag: string };

/**
 * 見出しの階層の深さ（0 が最上位）。
 *
 * 本文の見出しは h2 から始まる（h1 は記事タイトル）ので h2 を 0 とする。
 * 目次コンポーネント3つがそれぞれ `tag === 'h2' ? ... : tag === 'h3' ? ...` と
 * 直書きしていて、見出しレベルを1段下げたときに全部が壊れる状態だった。
 */
export function tocDepth(tag: string): number {
  const level = Number.parseInt(tag.replace(/^h/i, ''), 10);
  if (!Number.isFinite(level)) return 0;
  return Math.max(0, Math.min(2, level - 2));
}
