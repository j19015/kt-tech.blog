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
 *
 * あわせて配信ホストも差し替える。Notion に保存されている URL は R2 の
 * パブリック開発 URL（pub-*.r2.dev）だが、これは HTTP/1.1 でしか話せず
 * Cloudflare のキャッシュも効かない（Cloudflare 自身が本番非推奨としている）。
 * バケットに繋いだカスタムドメインなら HTTP/2 かつキャッシュが効く。
 */

/** R2 のアイキャッチ置き場。ここに一致する URL だけ差し替える */
const EYECATCH_PATH = '/images/eyecatch/';

/** Notion に保存されている配信元。レート制限があり本番向けではない */
const R2_PUBLIC_HOST = 'pub-9d03846db4364486bb0806774184931a.r2.dev';
/** バケットに繋いだカスタムドメイン。HTTP/2 + Cloudflare のキャッシュが効く */
const R2_CUSTOM_HOST = 'img.kt-tech.blog';

/** 生成スクリプトの VARIANTS と名前を合わせること */
type Variant = 'thumb' | 'medium';

/**
 * R2 の配信ホストをカスタムドメインへ寄せる。
 * R2 以外（Notion の画像やローカルのフォールバック）はそのまま返す。
 */
export function toCustomHost(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  return url.replace(`https://${R2_PUBLIC_HOST}`, `https://${R2_CUSTOM_HOST}`);
}

function variantUrl(url: string | undefined | null, variant: Variant): string | undefined {
  if (!url) return undefined;
  if (!url.includes(EYECATCH_PATH)) return toCustomHost(url);
  // すでに派生版を指しているなら二重変換しない
  if (/\/images\/eyecatch\/(thumb|medium)\//.test(url)) return toCustomHost(url);
  // 生成側は拡張子を .webp に揃えている
  const resized = url
    .replace(EYECATCH_PATH, `${EYECATCH_PATH}${variant}/`)
    .replace(/\.(png|jpe?g)$/i, '.webp');
  return toCustomHost(resized);
}

/** 一覧カード用（幅 320px）。表示は 96〜128px */
export function thumbnailUrl(url: string | undefined | null): string | undefined {
  return variantUrl(url, 'thumb');
}

/** トップのフィーチャー・サブ記事用（幅 768px）。表示は最大 600px */
export function mediumUrl(url: string | undefined | null): string | undefined {
  return variantUrl(url, 'medium');
}
