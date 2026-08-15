/**
 * アイキャッチ画像の URL 変換。
 *
 * Cloudflare Pages では Next.js の画像最適化が動かないので
 * （next.config.js の `images.unoptimized: true`）、R2 に置いた原寸 1376px が
 * どこでもそのまま配信される。一覧カードでの表示は 96〜128px、
 * トップのフィーチャーでも 600px しかなく、1枚あたり数十 KB を捨てていた。
 *
 * `scripts/generate-eyecatch-thumbnails.mjs` が幅ごとの版を作って
 * `images/eyecatch/<variant>/` に置くので、用途に合わせてそれを見る。
 */

/** R2 のアイキャッチ置き場。ここに一致する URL だけ差し替える */
const EYECATCH_PATH = '/images/eyecatch/';

/** 生成スクリプトの VARIANTS と名前を合わせること */
type Variant = 'thumb' | 'medium';

function variantUrl(url: string | undefined | null, variant: Variant): string | undefined {
  if (!url) return undefined;
  if (!url.includes(EYECATCH_PATH)) return url;
  // すでに派生版を指しているなら二重変換しない
  if (/\/images\/eyecatch\/(thumb|medium)\//.test(url)) return url;
  // 生成側は拡張子を .webp に揃えている
  return url.replace(EYECATCH_PATH, `${EYECATCH_PATH}${variant}/`).replace(/\.(png|jpe?g)$/i, '.webp');
}

/** 一覧カード用（幅 320px）。表示は 96〜128px */
export function thumbnailUrl(url: string | undefined | null): string | undefined {
  return variantUrl(url, 'thumb');
}

/** トップのフィーチャー・サブ記事用（幅 768px）。表示は最大 600px */
export function mediumUrl(url: string | undefined | null): string | undefined {
  return variantUrl(url, 'medium');
}
