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

/** 最上位の見出しと、その配下にぶら下がる下位見出し */
export type TocGroup = {
  /** 章の見出し。文書が下位見出しから始まる場合だけ null */
  parent: TocItem | null;
  children: TocItem[];
};

/**
 * 目次を「最上位の見出し + その配下」の塊に分ける。
 *
 * 見出しが多い記事では、下位見出しまで常に並べると目次が本文より長くなり、
 * 内側にスクロールバーが出て全体像が見えなくなる。
 * 読んでいる章の下位見出しだけを開く、という見せ方をするための下ごしらえ。
 */
export function groupToc(toc: TocItem[]): TocGroup[] {
  const groups: TocGroup[] = [];
  for (const item of toc) {
    if (tocDepth(item.tag) === 0 || groups.length === 0) {
      groups.push({ parent: tocDepth(item.tag) === 0 ? item : null, children: [] });
      if (tocDepth(item.tag) === 0) continue;
    }
    groups[groups.length - 1].children.push(item);
  }
  return groups;
}

/**
 * 下位見出しを折りたたむかどうか。
 *
 * 短い目次まで畳むと、開閉のたびに項目が動くだけで何も得しない。
 * 全部並べても収まる長さなら、そのまま出したほうが読みやすい。
 */
export const TOC_COLLAPSE_THRESHOLD = 12;

export function shouldCollapse(toc: TocItem[]): boolean {
  return toc.length > TOC_COLLAPSE_THRESHOLD && toc.some((item) => tocDepth(item.tag) > 0);
}
