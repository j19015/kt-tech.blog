/**
 * アイキャッチ画像の URL 変換。
 *
 * Cloudflare Pages では Next.js の画像最適化が動かないので
 * （next.config.js の `images.unoptimized: true`）、R2 に置いた原寸が
 * そのまま配信される。記事ページのヒーローには 1376px 幅が要るが、
 * 一覧カードでの表示は 96〜128px しかなく、1枚あたり 50KB 前後を捨てていた。
 *
 * そこで `scripts/generate-eyecatch-thumbnails.mjs` で幅 320px の版を
 * `images/eyecatch/thumb/` に用意し、カードだけそちらを見る。
 */

/** R2 のアイキャッチ置き場。ここに一致する URL だけ差し替える */
const EYECATCH_PATH = '/images/eyecatch/';
const THUMB_PATH = '/images/eyecatch/thumb/';

/**
 * 一覧カード用のサムネイル URL を返す。
 *
 * R2 のアイキャッチ以外（ローカルのフォールバック画像や Notion の画像）は
 * サムネイルを持たないので、渡された URL をそのまま返す。
 */
export function thumbnailUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  if (!url.includes(EYECATCH_PATH)) return url;
  // すでにサムネイルなら二重変換しない
  if (url.includes(THUMB_PATH)) return url;
  // 生成側は拡張子を .webp に揃えている
  return url.replace(EYECATCH_PATH, THUMB_PATH).replace(/\.(png|jpe?g)$/i, '.webp');
}
